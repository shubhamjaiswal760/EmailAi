# AI Email Sender

A full-stack application that generates and sends professional emails using AI. Built with React frontend and Node.js backend.

## Features

- 🤖 AI-powered email generation using Groq's Llama 3.3 70B model
- ✏️ Editable generated emails with specific, relevant subject lines
- 📧 Send emails to multiple recipients
- 📎 File attachments support (up to 5 files, 10MB each)
- 🎨 Modern, responsive UI with glass morphism design
- ⚡ Real-time feedback and loading states
- 🚀 Ultra-fast AI responses with Groq's optimized inference

## Tech Stack

### Frontend

- React 18
- Tailwind CSS
- Axios for API calls
- Lucide React for icons

### Backend

- Node.js with Express
- Groq API for ultra-fast email generation
- Nodemailer for email sending
- CORS enabled for cross-origin requests

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key (get one at https://console.groq.com/)
- Gmail account with app password

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

4. Configure your environment variables in `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
PORT=5000
```

**Note:** For Gmail, you'll need to:

1. **Enable 2-Factor Authentication:**

   - Go to: https://myaccount.google.com/security
   - Click on "2-Step Verification" and follow the setup process

2. **Generate App Password:**

   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" under "Select app"
   - Select "Other (Custom name)" under "Select device"
   - Type "AI Email Sender" as the name
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Use the app password** instead of your regular Gmail password

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Running the Application

1. Start the backend server (from backend directory):

```bash
npm run dev
```

2. Start the frontend (from frontend directory):

```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Enter Recipients**: Add email addresses separated by commas
2. **Write a Prompt**: Describe the email you want to generate
3. **Generate Email**: Click the "Generate Email" button
4. **Edit Email**: Modify the generated subject and body as needed
5. **Add Attachments**: Click "Add Files" to attach documents, images, or other files
6. **Send Email**: Click "Send Email" to send to all recipients with attachments

## Deployment to Vercel

### Prerequisites

- Vercel account
- Environment variables configured

### Steps

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy the application:**

   ```bash
   vercel
   ```

4. **Configure environment variables in Vercel dashboard:**

   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add these variables:
     - `GROQ_API_KEY` (your Groq API key)
     - `EMAIL_USER` (your Gmail address)
     - `EMAIL_PASS` (your Gmail app password)

5. **Redeploy after setting environment variables:**
   ```bash
   vercel --prod
   ```

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `GROQ_API_KEY`: Your Groq API key (get one at https://console.groq.com/)
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password

## API Endpoints

### Generate Email

- **POST** `/api/generate-email`
- **Body**: `{ "prompt": "your email prompt" }`
- **Response**: `{ "success": true, "email": { "subject": "...", "body": "..." } }`

### Send Email

- **POST** `/api/send-email`
- **Body**: `{ "recipients": "email1@example.com, email2@example.com", "subject": "...", "body": "..." }`
- **Response**: `{ "success": true, "message": "Email sent successfully!" }`

### Health Check

- **GET** `/api/health`
- **Response**: `{ "status": "OK", "message": "AI Email Sender Backend is running" }`

## Project Structure

```
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment variables template
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Frontend dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js  # PostCSS configuration
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

If you encounter any issues:

1. **Check that all environment variables are set correctly**
2. **Ensure your Gmail app password is valid:**
   - Verify 2FA is enabled: https://myaccount.google.com/security
   - Check app passwords: https://myaccount.google.com/apppasswords
   - Make sure you copied the 16-character password correctly (no spaces)
3. **Verify your Groq API key is active** (get one at https://console.groq.com/)
4. **Check the browser console and server logs for errors**
