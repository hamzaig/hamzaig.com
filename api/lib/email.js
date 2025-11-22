const nodemailer = require('nodemailer');

async function sendEmail(options) {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_FROM_EMAIL,
    SMTP_FROM_NAME,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USERNAME || !SMTP_PASSWORD || !SMTP_FROM_EMAIL) {
    throw new Error('SMTP configuration is missing. Please check your environment variables.');
  }

  const port = parseInt(SMTP_PORT);
  const isSecure = SMTP_SECURE === 'true' || SMTP_SECURE === '1' || port === 465;
  
  // Configure transporter with proper TLS/SSL settings
  const transporterConfig = {
    host: SMTP_HOST,
    port: port,
    secure: isSecure, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD+"$",
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false,
    },
    // Connection timeout settings
    connectionTimeout: isSecure ? 30000 : 10000,
    greetingTimeout: isSecure ? 30000 : 10000,
    socketTimeout: isSecure ? 30000 : 10000,
  };

  const transporter = nodemailer.createTransport(transporterConfig);

  // Verify connection before sending
  try {
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
  } catch (verifyError) {
    console.error('❌ SMTP verification failed:', {
      message: verifyError.message,
      code: verifyError.code,
      command: verifyError.command,
      response: verifyError.response,
      responseCode: verifyError.responseCode,
    });
    throw new Error(`SMTP connection verification failed: ${verifyError.message}. Please check your SMTP settings (Host: ${SMTP_HOST}, Port: ${port}, Secure: ${isSecure})`);
  }

  const from = SMTP_FROM_NAME
    ? `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`
    : SMTP_FROM_EMAIL;

  const mailOptions = {
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  };

  try {
    console.log('📤 Sending email...', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      from: mailOptions.from,
    });
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', {
      messageId: result.messageId,
      response: result.response,
    });
    return result;
  } catch (sendError) {
    console.error('❌ Email send error:', {
      message: sendError.message,
      code: sendError.code,
      command: sendError.command,
      response: sendError.response,
      responseCode: sendError.responseCode,
      errno: sendError.errno,
    });
    throw new Error(`Failed to send email: ${sendError.message}`);
  } finally {
    // Close the transporter connection
    try {
      transporter.close();
    } catch (closeError) {
      console.error('Error closing transporter:', closeError);
    }
  }
}

function formatContactEmailHTML(contactData) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(94deg, #f8aabd, #daed1a); padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #0f0f0f; margin: 0;">New Contact Form Submission</h2>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #dedede; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #dedede; font-weight: bold; width: 40%;">Name:</td>
              <td style="padding: 12px; border-bottom: 1px solid #dedede;">${contactData.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #dedede; font-weight: bold;">Email:</td>
              <td style="padding: 12px; border-bottom: 1px solid #dedede;">
                <a href="mailto:${contactData.email}" style="color: #f8aabd; text-decoration: none;">${contactData.email}</a>
              </td>
            </tr>
            ${contactData.phone ? `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #dedede; font-weight: bold;">Phone:</td>
              <td style="padding: 12px; border-bottom: 1px solid #dedede;">
                <a href="tel:${contactData.phone}" style="color: #f8aabd; text-decoration: none;">${contactData.phone}</a>
              </td>
            </tr>
            ` : ''}
            ${contactData.company ? `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #dedede; font-weight: bold;">Company:</td>
              <td style="padding: 12px; border-bottom: 1px solid #dedede;">${contactData.company}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #dedede; font-weight: bold;">Service Type:</td>
              <td style="padding: 12px; border-bottom: 1px solid #dedede;">${contactData.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #dedede; font-weight: bold;">Budget Range:</td>
              <td style="padding: 12px; border-bottom: 1px solid #dedede;">${contactData.budget}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #dedede; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 12px; border-bottom: 1px solid #dedede; white-space: pre-wrap;">${contactData.message}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding: 20px; background: #fff; border-left: 4px solid #f8aabd; border-radius: 4px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Next Steps:</strong><br>
              Please respond to this inquiry promptly to maintain a good customer experience.
            </p>
          </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center; color: #999; font-size: 12px;">
          <p>This email was automatically generated from the hamzaig.com contact form.</p>
        </div>
      </body>
    </html>
  `;
}

module.exports = { sendEmail, formatContactEmailHTML };

