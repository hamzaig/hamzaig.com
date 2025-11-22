const connectDB = require('./lib/mongodb');
const Contact = require('./models/Contact');
const { sendEmail, formatContactEmailHTML } = require('./lib/email');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed'
    });
  }

  try {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded')) {
      return res.status(415).json({
        ok: false,
        error: 'Invalid content type'
      });
    }

    const body = req.body;
    
    const payload = {
      name: String(body.inputName || body.name || '').trim(),
      email: String(body.inputEmail || body.email || '').trim().toLowerCase(),
      phone: String(body.inputPhone || body.phone || '').trim(),
      company: (body.inputCompany || body.company) ? String(body.inputCompany || body.company).trim() : undefined,
      serviceType: String(body.inputServiceType || body.serviceType || '').trim(),
      budget: String(body.inputBudget || body.budget || '').trim(),
      subject: (body.inputSubject || body.subject) ? String(body.inputSubject || body.subject).trim() : 'HamzaIG Inquiry',
      message: String(body.inputMessage || body.message || '').trim(),
      consent: Boolean(body.inputConsent || body.consent),
    };

    // Validation
    const errors = {};

    if (!payload.name || payload.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!payload.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(payload.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!payload.serviceType || payload.serviceType.length === 0) {
      errors.serviceType = 'Please select a service type';
    }

    if (!payload.budget || payload.budget.length === 0) {
      errors.budget = 'Please select a budget range';
    }

    if (!payload.message || payload.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    if (!payload.consent) {
      errors.consent = 'You must agree to be contacted';
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        ok: false,
        errors,
        error: 'Please check your form and try again.'
      });
    }

    // Connect to MongoDB
    await connectDB();

    // Create new contact document
    const contact = new Contact(payload);
    await contact.save();

    // Send email notification
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'hamzaig@yahoo.com';
      
      // Log email configuration (without sensitive data)
      console.log('📧 Attempting to send email:', {
        to: adminEmail,
        from: process.env.SMTP_FROM_EMAIL,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        hasUsername: !!process.env.SMTP_USERNAME,
        hasPassword: !!process.env.SMTP_PASSWORD,
      });
      
      const emailHTML = formatContactEmailHTML({
        name: payload.name,
        email: payload.email,
        phone: payload.phone || 'Not provided',
        company: payload.company,
        serviceType: payload.serviceType,
        budget: payload.budget,
        message: payload.message,
      });

      await sendEmail({
        to: adminEmail,
        subject: `New Contact Form Submission - ${payload.serviceType}`,
        html: emailHTML,
      });

      console.log(`✅ Email notification sent successfully to ${adminEmail}`);
    } catch (emailError) {
      // Log detailed email error
      console.error('❌ Failed to send email notification:', {
        message: emailError.message,
        stack: emailError.stack,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        fromEmail: process.env.SMTP_FROM_EMAIL,
        username: process.env.SMTP_USERNAME,
        hasPassword: !!process.env.SMTP_PASSWORD,
        errorCode: emailError.code,
        errorNo: emailError.errno,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode,
      });
      
      // Log full error for debugging
      console.error('Full email error:', JSON.stringify(emailError, Object.getOwnPropertyNames(emailError)));
      
      // Continue with successful response even if email fails
      // The form data is still saved in MongoDB
    }

    return res.status(201).json({
      ok: true,
      message: "Thanks for reaching out! We'll get back to you soon.",
      id: contact._id,
    });
  } catch (error) {
    console.error('Contact form submission error:', error);

    // Handle duplicate key errors (if email is unique)
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        error: 'This email has already been submitted'
      });
    }

    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        ok: false,
        errors: validationErrors
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'Failed to submit contact form. Please try again.'
    });
  }
};

