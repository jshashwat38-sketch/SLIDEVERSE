"use server";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

// Transporter is now created inside the function for serverless stability




export async function loginUser(email: string, pass: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
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
  console.log(`[AUTH] Initiating OTP dispatch for ${email} (${type})`);
  try {
    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();
    
    const userExists = !!user;
    
    if (type === 'reset' && !userExists) {
      console.log(`[AUTH] Reset failed: Email ${email} not registered.`);
      return { success: false, error: "Email not registered." };
    }

    if (type === 'signup' && userExists) {
      console.log(`[AUTH] Signup failed: Email ${email} already registered.`);
      return { success: false, error: "Email already registered." };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Remove old OTPs for this email and insert new one
    console.log(`[AUTH] Generating OTP: ${otp}`);
    await supabase.from('otps').delete().eq('email', email.toLowerCase());
    const { error: dbError } = await supabase.from('otps').insert({ email: email.toLowerCase(), otp, expires });
    
    if (dbError) {
      console.error("[AUTH] Database error during OTP insert:", dbError);
      return { success: false, error: "Vault synchronization failure." };
    }
    
    // Send Real Email
    const emailUser = process.env.EMAIL_USER || 'SLIDEVERSESTUDIO@GMAIL.COM';
    const emailPass = process.env.EMAIL_PASS || 'vmmpfnlojdteexza';

    try {
      console.log(`[AUTH] Attempting email dispatch via ${emailUser}`);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      // Test connection
      await transporter.verify();
      console.log("[AUTH] SMTP Connection Verified.");

      const info = await transporter.sendMail({
        from: `"Slideverse Security" <${emailUser}>`,
        to: email,
        subject: `${otp} is your Slideverse Verification Sequence`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; padding: 60px 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #050505; border: 2px solid #C5A572; border-radius: 40px; padding: 50px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
              <div style="margin-bottom: 40px;">
                <h1 style="color: #C5A572; font-size: 24px; font-weight: 900; letter-spacing: 5px; text-transform: uppercase; margin: 0;">SLIDEVERSE PRO</h1>
                <p style="color: #FFFFFF; font-size: 10px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; margin-top: 10px; opacity: 0.8;">Secure Identity Protocol</p>
              </div>
              <h2 style="font-size: 32px; font-weight: 900; font-style: italic; text-transform: uppercase; margin-bottom: 20px; color: #fff;">Verification Required</h2>
              <p style="color: #A1A1AA; font-size: 14px; line-height: 1.6; margin-bottom: 40px;">Initiating authorization sequence for your operative account. Enter the following 6-digit code to establish identity.</p>
              <div style="background-color: #000000; border: 3px solid #C5A572; border-radius: 20px; padding: 30px; display: inline-block; min-width: 220px;">
                <span style="font-size: 48px; font-weight: 900; color: #C5A572; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace;">${otp}</span>
              </div>
              <p style="color: #FFFFFF; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin-top: 40px; opacity: 0.6;">This sequence will expire in 10 minutes.</p>
              <div style="margin-top: 50px; border-top: 1px solid #C5A572; padding-top: 30px;">
                <p style="color: #FFFFFF; font-size: 10px; margin-top: 30px; opacity: 0.4;">If you did not initiate this protocol, ignore this broadcast.</p>
              </div>
            </div>
          </div>
        `,
      });
      console.log("[AUTH] Email sent successfully:", info.messageId);

    } catch (err: any) {
      console.error("[AUTH] Failed to send real email:", err.message);
      return { success: false, error: `Communication failure: ${err.message}` };
    }



    console.log("------------------------------------------");
    console.log(`SECURE OTP FOR ${email.toUpperCase()}: ${otp}`);
    console.log("------------------------------------------");

    // await new Promise(resolve => setTimeout(resolve, 1500)); // Removed delay to speed up dispatch
    return { success: true, message: "Authorization sequence dispatched." };
  } catch (error) {
    return { success: false, error: "System failure during OTP dispatch." };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    const { data: record, error } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('otp', otp)
      .single();
    
    if (!record) return { success: false, error: "Invalid authorization sequence or no active request." };
    if (new Date() > new Date(record.expires)) return { success: false, error: "Authorization sequence expired." };

    return { success: true };
  } catch (error) {
    return { success: false, error: "Verification system failure." };
  }
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  try {
    const verification = await verifyOTP(email, otp);
    if (!verification.success) return verification;

    const { error } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('email', email.toLowerCase());
    
    if (error) return { success: false, error: "Failed to update vault credentials." };

    // Clear OTP
    await supabase.from('otps').delete().eq('email', email.toLowerCase());

    return { success: true, message: "Credential vault updated successfully." };
  } catch (error) {
    return { success: false, error: "Failed to update vault credentials." };
  }
}

export async function registerUser(userData: any) {
  try {
    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      phone: userData.phone,
      password: userData.password,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('users').insert(newUser);
    
    if (error) {
      if (error.code === '23505') return { success: false, error: "Identity endpoint already registered." };
      return { success: false, error: "Registration protocol failure." };
    }
    
    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, error: "Registration protocol failure." };
  }
}

export async function getUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function deleteUser(id: string) {
  try {
    console.log(`[SYSTEM] Initiating identity termination for: ${id}`);
    const { error, count } = await supabase
      .from('users')
      .delete({ count: 'exact' })
      .eq('id', id);
    
    if (error) throw error;
    if (count === 0) {
      console.warn(`[SYSTEM] Identity not found: ${id}`);
      return { success: false, error: "Identity not found in database." };
    }

    console.log(`[SYSTEM] Identity terminated: ${id}`);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("[SYSTEM ERROR] Failed to terminate identity:", error);
    return { success: false, error: "Failed to delete identity." };
  }
}
