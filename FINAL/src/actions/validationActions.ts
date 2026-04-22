"use server";

import dns from "dns";
import { promisify } from "util";

const resolveMx = promisify(dns.resolveMx);

/**
 * Checks if a domain has valid MX records
 * This is a stronger check to ensure the email is "actual"
 */
export async function verifyEmailDomain(email: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const domain = email.split("@")[1];
    if (!domain) return { isValid: false, error: "Invalid identity endpoint." };

    const mxRecords = await resolveMx(domain);
    
    if (!mxRecords || mxRecords.length === 0) {
      return { isValid: false, error: "Identity endpoint unreachable (No MX records)." };
    }

    return { isValid: true };
  } catch (error) {
    console.error("DNS Resolution Error:", error);
    return { isValid: false, error: "Identity endpoint could not be verified." };
  }
}
