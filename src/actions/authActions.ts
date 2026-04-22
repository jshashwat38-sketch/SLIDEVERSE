"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

const USERS_PATH = path.join(process.cwd(), "src", "data", "users.json");
const OTPS_PATH = path.join(process.cwd(), "src", "data", "otps.json");

// Helper to read/write data
async function getData(filePath: string) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveData(filePath: string, data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function loginUser(email: string, pass: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = await getData(USERS_PATH);
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (user && user.password === pass) {
      const { password, ...userWithoutPass } = user;
      return { success: true, user: userWithoutPass };
    }
    return { success: false, error: "Incorrect email or password." };
  } catch (error) {
    return { success: false, error: "Auth system failure." };
  }
}

export async function sendOTP(email: string, type: 'reset' | 'signup' = 'reset') {
  try {
    // Check if user exists
    const users = await getData(USERS_PATH);
    const userExists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (type === 'reset' && !userExists) {
      return { success: false, error: "Email not registered." };
    }

    if (type === 'signup' && userExists) {
      return { success: false, error: "Email already registered." };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    const otps = await getData(OTPS_PATH);
    // Remove old OTPs for this email
    const filteredOtps = otps.filter((o: any) => o.email !== email);
    filteredOtps.push({ email, otp, expires });
    await saveData(OTPS_PATH, filteredOtps);
    
    // Send Real Email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: `"Slideverse Security" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: `${otp} is your Slideverse Verification Sequence`,
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000; color: #fff; padding: 60px 20px; text-align: center;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #1a1a1a; border-radius: 40px; padding: 50px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="margin-bottom: 40px;">
                  <h1 style="color: #c5a572; font-size: 24px; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; margin: 0;">SLIDEVERSE PRO</h1>
                  <p style="color: #666; font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin-top: 10px;">Secure Identity Protocol</p>
                </div>
                <h2 style="font-size: 32px; font-weight: 900; font-style: italic; text-transform: uppercase; margin-bottom: 20px;">Verification Required</h2>
                <p style="color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 40px;">Initiating authorization sequence for your operative account. Enter the following 6-digit code to establish identity.</p>
                <div style="background-color: rgba(197,165,114,0.1); border: 1px solid rgba(197,165,114,0.3); border-radius: 20px; padding: 30px; display: inline-block; min-width: 200px;">
                  <span style="font-size: 48px; font-weight: 900; color: #c5a572; letter-spacing: 10px; font-family: monospace;">${otp}</span>
                </div>
                <p style="color: #444; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-top: 40px;">This sequence will expire in 10 minutes.</p>
                <div style="margin-top: 50px; border-top: 1px solid #1a1a1a; pt-30px">
                  <p style="color: #555; font-size: 10px; margin-top: 30px;">If you did not initiate this protocol, ignore this broadcast.</p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (err) {
        console.error("Failed to send real email:", err);
      }
    }

    console.log("------------------------------------------");
    console.log(`SECURE OTP FOR ${email.toUpperCase()}: ${otp}`);
    console.log("------------------------------------------");

    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: "Authorization sequence dispatched." };
  } catch (error) {
    return { success: false, error: "System failure during OTP dispatch." };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const otps = await getData(OTPS_PATH);
    const record = otps.find((o: any) => o.email === email);
    
    if (!record) return { success: false, error: "No active authorization request." };
    if (Date.now() > record.expires) return { success: false, error: "Authorization sequence expired." };
    if (record.otp !== otp) return { success: false, error: "Invalid authorization sequence." };

    return { success: true };
  } catch (error) {
    return { success: false, error: "Verification system failure." };
  }
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const verification = await verifyOTP(email, otp);
    if (!verification.success) return verification;

    const users = await getData(USERS_PATH);
    const userIndex = users.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) return { success: false, error: "Identity lost during sequence." };

    users[userIndex].password = newPassword;
    await saveData(USERS_PATH, users);

    // Clear OTP
    const otps = await getData(OTPS_PATH);
    const filteredOtps = otps.filter((o: any) => o.email !== email);
    await saveData(OTPS_PATH, filteredOtps);

    return { success: true, message: "Credential vault updated successfully." };
  } catch (error) {
    return { success: false, error: "Failed to update vault credentials." };
  }
}

export async function registerUser(userData: any) {
  try {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const users = await getData(USERS_PATH);
    
    // Check if email already exists
    if (users.some((u: any) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: "Identity endpoint already registered." };
    }

    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password, // Stored in plain text as requested for admin view
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await saveData(USERS_PATH, users);
    
    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, error: "Registration protocol failure." };
  }
}

export async function getUsers() {
  try {
    return await getData(USERS_PATH);
  } catch {
    return [];
  }
}

export async function deleteUser(id: string) {
  try {
    const users = await getData(USERS_PATH);
    const filteredUsers = users.filter((u: any) => u.id !== id);
    await saveData(USERS_PATH, filteredUsers);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete identity." };
  }
}
