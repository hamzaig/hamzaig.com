require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./lib/mongodb');
const Contact = require('./models/Contact');
const { sendEmail, formatContactEmailHTML } = require('./lib/email');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
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

    if (!payload.phone || payload.phone.length < 11) {
      errors.phone = 'Phone number must be at least 11 digits';
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
      const emailHTML = formatContactEmailHTML({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
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
      // Log email error but don't fail the request
      console.error('❌ Failed to send email notification:', {
        message: emailError.message,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        error: emailError.code || emailError.errno,
      });
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
});

// Optional: GET endpoint to retrieve contacts (for admin purposes)
app.get('/api/contact', async (req, res) => {
  try {
    await connectDB();

    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Contact.countDocuments();

    return res.json({
      ok: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({
      ok: false,
      error: 'Failed to fetch contacts'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`🗄️  MongoDB: Connected`);
});

