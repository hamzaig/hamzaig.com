# Contact Form API Setup Guide

## Overview

The contact form now uses a Node.js API server that:
- ✅ Saves submissions to MongoDB
- ✅ Sends email notifications via SMTP (Zoho)
- ✅ Validates form data
- ✅ Handles errors gracefully

## Quick Start

### 1. Install Dependencies

```bash
cd api
npm install
```

Or run the setup script:
```bash
cd api
./setup.sh
```

### 2. Environment Variables

The `.env` file has been created with your credentials:
- MongoDB connection string
- SMTP settings (Zoho)
- Admin email (hamzaig@yahoo.com)

### 3. Start the Server

```bash
cd api
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at: `http://localhost:3000`

### 4. Update Frontend (if needed)

The form in `index.html` is already configured to use:
```html
action="http://localhost:3000/api/contact"
```

**For Production:** Update this URL to your actual API server URL.

## API Endpoints

### POST /api/contact
Submit contact form data.

**Request Format:**
```json
{
  "inputName": "John Doe",
  "inputEmail": "john@example.com",
  "inputPhone": "12345678901",
  "inputCompany": "Company Name (optional)",
  "inputServiceType": "Web Development",
  "inputBudget": "$10k - $25k",
  "inputMessage": "Project details...",
  "inputConsent": true
}
```

**Success Response:**
```json
{
  "ok": true,
  "message": "Thanks for reaching out! We'll get back to you soon.",
  "id": "contact_id"
}
```

### GET /api/contact
Retrieve contact submissions (admin only).

### GET /health
Health check endpoint.

## Features

1. **MongoDB Integration**
   - All submissions are saved to MongoDB
   - Indexed for fast queries
   - Timestamps automatically added

2. **Email Notifications**
   - HTML formatted emails
   - Sent to admin email (hamzaig@yahoo.com)
   - Includes all form data
   - Professional email template

3. **Validation**
   - Client-side and server-side validation
   - Clear error messages
   - Required fields enforced

4. **Error Handling**
   - Graceful error handling
   - Email failures don't block form submission
   - Data still saved even if email fails

## Production Deployment

1. **Update API URL**
   - Change `localhost:3000` to your production API URL in `index.html`
   - Or use environment-based configuration

2. **Environment Variables**
   - Set all environment variables in your hosting platform
   - Never commit `.env` file to git

3. **Server Requirements**
   - Node.js 14+ 
   - MongoDB connection
   - SMTP access

4. **Security**
   - Enable CORS only for your domain
   - Use HTTPS in production
   - Validate all inputs server-side

## Troubleshooting

### MongoDB Connection Issues
- Check MongoDB connection string
- Verify network access
- Check MongoDB Atlas IP whitelist

### Email Not Sending
- Verify SMTP credentials
- Check SMTP port (465 for SSL)
- Verify SMTP_SECURE setting
- Check firewall/network restrictions

### Form Not Submitting
- Check browser console for errors
- Verify API server is running
- Check CORS settings
- Verify API URL is correct

## File Structure

```
api/
├── server.js          # Main API server
├── lib/
│   ├── mongodb.js     # MongoDB connection
│   └── email.js       # Email functionality
├── models/
│   └── Contact.js     # Contact model
├── .env               # Environment variables
├── package.json       # Dependencies
└── README.md          # API documentation
```

## Support

For issues or questions, check:
- API logs in console
- MongoDB connection status
- SMTP configuration
- Browser console for frontend errors

