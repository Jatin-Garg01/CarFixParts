const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email service is ready to send emails');
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, carMake, carModel, carYear, partName, partNumber, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !carMake || !carModel || !carYear || !partName) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // Email to business
    const businessEmailContent = `
      <h2>New Car Part Request</h2>
      <p><strong>Customer Details:</strong></p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
      </ul>
      
      <p><strong>Vehicle Information:</strong></p>
      <ul>
        <li><strong>Make:</strong> ${carMake}</li>
        <li><strong>Model:</strong> ${carModel}</li>
        <li><strong>Year:</strong> ${carYear}</li>
      </ul>
      
      <p><strong>Part Information:</strong></p>
      <ul>
        <li><strong>Part Name:</strong> ${partName}</li>
        <li><strong>Part Number:</strong> ${partNumber || 'Not provided'}</li>
      </ul>
      
      <p><strong>Additional Details:</strong></p>
      <p>${message || 'No additional details provided'}</p>
    `;

    // Email to customer
    const customerEmailContent = `
      <h2>Thank You for Your Request</h2>
      <p>Dear ${name},</p>
      <p>We have received your car part request. Our team will review your requirements and contact you shortly with the best options and pricing.</p>
      
      <p><strong>Request Summary:</strong></p>
      <ul>
        <li><strong>Car:</strong> ${carYear} ${carMake} ${carModel}</li>
        <li><strong>Part Needed:</strong> ${partName}</li>
      </ul>
      
      <p>We appreciate your business and look forward to helping you!</p>
      <p>Best regards,<br>CarFixParts Team</p>
    `;

    // Send email to business
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.BUSINESS_EMAIL || process.env.EMAIL_USER,
      subject: `New Car Part Request from ${name}`,
      html: businessEmailContent,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'CarFixParts - Request Received',
      html: customerEmailContent,
    });

    res.status(200).json({
      success: true,
      message: 'Your request has been sent successfully! We will contact you soon.',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send request. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
