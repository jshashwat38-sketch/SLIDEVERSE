const nodemailer = require('nodemailer');

async function testEmail() {
  const EMAIL_USER = 'SLIDEVERSESTUDIO@GMAIL.COM';
  const EMAIL_PASS = 'vmmpfnlojdteexza';

  console.log('Testing Email for:', EMAIL_USER);
  
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('Transporter verified!');

    console.log('Sending test email to jshashwat38@gmail.com...');
    await transporter.sendMail({
      from: `"Slideverse Test" <${EMAIL_USER}>`,
      to: 'jshashwat38@gmail.com',
      subject: 'Slideverse Connection Test',
      text: 'If you receive this, your email configuration is working perfectly.',
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Email failed:', error.message);
  }
}

testEmail();
