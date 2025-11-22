# Vercel Deployment Guide

## Overview

This project is configured to deploy on Vercel with serverless functions for the contact form API.

## Project Structure

```
hamzaig.com/
├── api/
│   ├── contact.js          # POST /api/contact (serverless function)
│   ├── health.js           # GET /api/health (serverless function)
│   ├── lib/
│   │   ├── mongodb.js      # MongoDB connection
│   │   └── email.js        # Email functionality
│   └── models/
│       └── Contact.js      # Contact model
├── vercel.json             # Vercel configuration
├── package.json            # Dependencies (root level)
└── index.html              # Main website
```

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Create Root package.json

Create a `package.json` in the root directory:

```json
{
  "name": "hamzaig-com",
  "version": "1.0.0",
  "scripts": {
    "build": "echo 'No build step required'"
  },
  "dependencies": {
    "mongoose": "^8.0.3",
    "nodemailer": "^6.9.7"
  }
}
```

Or copy dependencies from `api/package.json` to root.

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty or `echo 'No build'`)
   - **Output Directory**: ./

### 4. Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
MONGODB_URL=mongodb+srv://team:dnZVafd0D8mWXLTS@main-moonsys.qyb7cay.mongodb.net/moonsys-co

SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USERNAME=admin@moonsys.co
SMTP_PASSWORD=MoonSys722942
SMTP_FROM_EMAIL=admin@moonsys.co
SMTP_FROM_NAME=MoonSYs
ADMIN_EMAIL=hamzaig@yahoo.com
```

**Important:** Set these for:
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Deploy

After setting environment variables, Vercel will automatically:
- Deploy your static files
- Deploy serverless functions from `/api` folder
- Make API available at `https://your-domain.vercel.app/api/contact`

## API Endpoints

After deployment, your API will be available at:

- **POST** `https://your-domain.vercel.app/api/contact` - Submit contact form
- **GET** `https://your-domain.vercel.app/api/health` - Health check

## Configuration Files

### vercel.json

The `vercel.json` file configures:
- Serverless function routing
- Environment variables (optional, can be set in dashboard)
- Static file serving

### Root package.json

Vercel needs a `package.json` in the root to install dependencies for serverless functions.

## Testing

1. **Health Check:**
   ```bash
   curl https://your-domain.vercel.app/api/health
   ```

2. **Contact Form:**
   - Open your deployed website
   - Fill out the contact form
   - Submit and check:
     - MongoDB for saved data
     - Email inbox for notification

## Troubleshooting

### Serverless Function Not Found

- Check that files are in `/api` folder
- Verify file names match route (e.g., `contact.js` → `/api/contact`)
- Check Vercel build logs

### Environment Variables Not Working

- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

### MongoDB Connection Issues

- Verify MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist (allow all IPs or Vercel IPs)
- Check network access settings

### Email Not Sending

- Verify SMTP credentials
- Check SMTP port (465 for SSL)
- Verify `SMTP_SECURE=true` for port 465
- Check Vercel function logs

### CORS Errors

- CORS is already configured in serverless functions
- If issues persist, check allowed origins

## Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. API will work at `https://your-domain.com/api/contact`

## Monitoring

- Check Vercel Dashboard → Functions for logs
- Monitor function execution time
- Check error rates in Analytics

## Updates

After making changes:
1. Push to Git repository
2. Vercel will auto-deploy (if connected to Git)
3. Or run `vercel --prod` manually

## Support

- Vercel Docs: https://vercel.com/docs
- Serverless Functions: https://vercel.com/docs/functions
- Environment Variables: https://vercel.com/docs/environment-variables

