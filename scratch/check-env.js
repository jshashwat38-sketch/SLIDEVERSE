const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function checkEnv() {
  console.log('--- Environment Check ---');
  console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'EXISTS' : 'MISSING');
  console.log('NEXT_PUBLIC_RAZORPAY_KEY_ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'EXISTS' : 'MISSING');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'EXISTS' : 'MISSING');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'EXISTS' : 'MISSING');
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'EXISTS' : 'MISSING');
  
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log('\n--- Testing Email Transporter ---');
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.verify();
      console.log('Email Transporter: VERIFIED');
    } catch (error) {
      console.error('Email Transporter: FAILED', error.message);
    }
  }
}

checkEnv();
