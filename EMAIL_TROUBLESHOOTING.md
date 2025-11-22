# Email Troubleshooting Guide

## Issue: Emails Not Being Sent

If emails are not being sent but data is saving to MongoDB, follow these steps:

## 1. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on "Functions" tab
4. Click on the latest function execution
5. Check the logs for:
   - `📧 Attempting to send email:` - Shows email configuration
   - `🔍 Verifying SMTP connection...` - SMTP verification
   - `✅ SMTP connection verified successfully` - Connection successful
   - `📤 Sending email...` - Email sending attempt
   - `✅ Email sent successfully` - Email sent
   - `❌ Failed to send email notification:` - Error details

## 2. Verify Environment Variables in Vercel

Go to: **Vercel Dashboard → Project Settings → Environment Variables**

Make sure these are set for **Production, Preview, AND Development**:

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

**Important Notes:**
- `SMTP_SECURE` must be `true` (string, not boolean) for port 465
- `SMTP_PORT` must be `465` (number as string)
- All variables are case-sensitive

## 3. Common Issues and Solutions

### Issue: SMTP Connection Verification Failed

**Possible Causes:**
- Wrong SMTP credentials
- Firewall blocking port 465
- SMTP_SECURE not set to "true"

**Solution:**
- Double-check username and password
- Verify `SMTP_SECURE=true` (as string)
- Try port 587 with `SMTP_SECURE=false` if 465 doesn't work

### Issue: Authentication Failed

**Possible Causes:**
- Wrong SMTP_USERNAME or SMTP_PASSWORD
- Zoho account security settings

**Solution:**
- Verify credentials are correct
- Check Zoho account for app-specific passwords
- Ensure account is not locked

### Issue: Timeout Errors

**Possible Causes:**
- Network issues
- Firewall restrictions
- SMTP server down

**Solution:**
- Check Vercel function timeout settings
- Verify SMTP server is accessible
- Try different port (587 instead of 465)

## 4. Test Email Configuration

After updating environment variables:
1. **Redeploy** the project (Vercel auto-deploys on git push)
2. Submit a test form
3. Check Vercel function logs immediately
4. Look for error messages in logs

## 5. Alternative: Use Different SMTP Provider

If Zoho continues to have issues, you can switch to:

### Gmail (with App Password)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=HamzaIG
```

### SendGrid
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=your-verified-email@domain.com
SMTP_FROM_NAME=HamzaIG
```

## 6. Check Email Spam Folder

Sometimes emails go to spam:
- Check spam/junk folder
- Verify sender email is not blacklisted
- Check email provider's spam filters

## 7. Debug Steps

1. **Check Logs First**: Always check Vercel function logs first
2. **Verify Variables**: Double-check all environment variables
3. **Test Connection**: Look for "SMTP connection verified" in logs
4. **Check Errors**: Look for specific error messages in logs
5. **Redeploy**: After changing env vars, redeploy is required

## 8. Current Logging

The code now logs:
- ✅ Email configuration (without passwords)
- ✅ SMTP connection verification
- ✅ Email sending attempts
- ✅ Success confirmations
- ❌ Detailed error information

All logs are available in Vercel function execution logs.

## Need Help?

If issues persist:
1. Share the error logs from Vercel
2. Verify all environment variables are set correctly
3. Check if SMTP credentials are valid
4. Try a different SMTP provider

