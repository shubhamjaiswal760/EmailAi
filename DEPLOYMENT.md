# Deployment Guide for AI Email Sender

## Prerequisites

1. **Vercel Account**: Make sure you have a Vercel account
2. **Environment Variables**: Set up the required environment variables

## Environment Variables Setup

You need to set these environment variables in your Vercel project:

### Required Environment Variables

1. **GROQ_API_KEY**: Your Groq API key
   - Get it from: https://console.groq.com/
   - Add to Vercel: Project Settings → Environment Variables

2. **EMAIL_USER**: Your Gmail address
   - Add to Vercel: Project Settings → Environment Variables

3. **EMAIL_PASS**: Your Gmail app password
   - Generate from: Google Account → Security → 2-Step Verification → App passwords
   - Add to Vercel: Project Settings → Environment Variables

## Deployment Steps

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Build the Project
```bash
npm run build
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and set environment variables
```

#### Option B: Using Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

## Troubleshooting 404 Errors

### Common Issues and Solutions:

1. **Missing Environment Variables**
   - Ensure all required environment variables are set in Vercel
   - Check Vercel dashboard → Project Settings → Environment Variables

2. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are properly installed

3. **API Routes Not Working**
   - Verify the `/api/` routes are correctly configured
   - Check that `backend/server.js` is properly built

4. **Frontend Not Loading**
   - Ensure the build output is in `frontend/build/`
   - Check that static files are being served correctly

## Testing Your Deployment

1. **Health Check**: Visit `https://your-domain.vercel.app/api/health`
2. **Frontend**: Visit `https://your-domain.vercel.app/`
3. **API Endpoints**: Test `/api/generate-email` and `/api/send-email`

## Local Development

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev
```

## File Structure
```
EmailAi/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── uploads/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json
├── vercel.json
└── README.md
```

## Support

If you're still experiencing issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check browser console for frontend errors
