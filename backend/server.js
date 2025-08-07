const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate AI email
app.post('/api/generate-email', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional email writer. Generate a well-structured, professional email based on the user's prompt. Create a specific, relevant subject line and a professional email body. Format the response as JSON with 'subject' and 'body' fields. The subject should be specific and relevant to the email content. The body should be a clean, professional email without any labels like 'Subject:' or 'Body:' - just the actual email content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    
    // Try to parse as JSON, if not, create a simple structure
    let emailData;
    try {
      emailData = JSON.parse(response);
    } catch (error) {
      // If not JSON, create a simple structure
      emailData = {
        subject: "AI Generated Email",
        body: response
      };
    }

    res.json({
      success: true,
      email: emailData
    });

  } catch (error) {
    console.error('Error generating email:', error);
    res.status(500).json({ 
      error: 'Failed to generate email',
      details: error.message 
    });
  }
});

// Send email with attachments
app.post('/api/send-email', upload.array('attachments', 5), async (req, res) => {
  try {
    const { recipients, subject, body } = req.body;
    const attachments = req.files || [];

    if (!recipients || !subject || !body) {
      return res.status(400).json({ 
        error: 'Recipients, subject, and body are required' 
      });
    }

    // Convert recipients string to array
    const recipientList = recipients.split(',').map(email => email.trim());

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientList.join(', '),
      subject: subject,
      html: body.replace(/\n/g, '<br>'),
      attachments: attachments.map(file => ({
        filename: file.originalname,
        path: file.path
      }))
    };

    const info = await transporter.sendMail(mailOptions);

    // Clean up uploaded files after sending
    attachments.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully!',
      attachmentsCount: attachments.length
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Email Sender Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 