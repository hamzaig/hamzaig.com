# HamzaIG Contact Form API

This is the Node.js API server for handling contact form submissions from hamzaig.com.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `api` directory with the following variables:
```env
MONGODB_URL=mongodb+srv://team:dnZVafd0D8mWXLTS@main-moonsys.qyb7cay.mongodb.net/moonsys-co

SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=admin@moonsys.co
SMTP_PASSWORD=MoonSys722942
SMTP_FROM_EMAIL=admin@moonsys.co
SMTP_FROM_NAME=MoonSYs
ADMIN_EMAIL=hamzaig@yahoo.com

PORT=3000
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /api/contact
Submit a contact form.

**Request Body:**
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

**Response:**
```json
{
  "ok": true,
  "message": "Thanks for reaching out! We'll get back to you soon.",
  "id": "contact_id"
}
```

### GET /api/contact
Retrieve contact submissions (for admin purposes).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### GET /health
Health check endpoint.

## Features

- ✅ MongoDB integration for storing contact submissions
- ✅ Email notifications via SMTP (Zoho)
- ✅ Form validation
- ✅ Error handling
- ✅ CORS enabled

## Deployment

Make sure to:
1. Set all environment variables in your hosting platform
2. Ensure MongoDB connection is accessible
3. Configure SMTP settings correctly
4. Update the API URL in the frontend form

