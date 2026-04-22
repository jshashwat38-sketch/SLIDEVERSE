/**
 * Utility for robust email validation
 * Includes format check and disposable email domain filtering
 */

const DISPOSABLE_DOMAINS = [
  // Common disposable services
  "tempmail.com", "mailinator.com", "10minutemail.com", 
  "guerrillamail.com", "yopmail.com", "trashmail.com",
  "dispostable.com", "getairmail.com", "hideone.me",
  "maildrop.cc", "mailexpire.com", "mailforage.com",
  "mailnull.com", "moakt.com", "pokemail.net",
  "protonmail.com", // Some businesses block protonmail, but we'll allow it for now unless requested
  "sharklasers.com", "spamgourmet.com", "temp-mail.org"
];

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) return { isValid: false, error: "Identity endpoint required." };
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // 1. Robust format check
  // Standard RFC 5322 regex is overkill, but this is better than the basic one
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, error: "Invalid identity endpoint format." };
  }

  // 2. Domain extraction
  const domain = trimmedEmail.split("@")[1];
  
  // 3. Disposable email check
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { isValid: false, error: "Temporary/Disposable relay detected. Please use a verified identity." };
  }

  // 4. Check for common typos
  const typos: Record<string, string> = {
    "gmal.com": "gmail.com",
    "hotmal.com": "hotmail.com",
    "yaho.com": "yahoo.com",
    "outlok.com": "outlook.com"
  };

  if (typos[domain]) {
    return { isValid: false, error: `Potential identity typo detected: did you mean @${typos[domain]}?` };
  }

  return { isValid: true };
}

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) return { isValid: false, error: "Access key required." };
  
  // 1. Length Check
  if (password.length < 8) {
    return { isValid: false, error: "Access key must be at least 8 characters." };
  }
  if (password.length > 64) {
    return { isValid: false, error: "Access key exceeds maximum security limit (64 chars)." };
  }

  // 2. Complexity Checks (Standard)
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    return { isValid: false, error: "Access key does not meet base complexity requirements." };
  }

  // 3. Silent Rules (Specific Error Messages)
  
  // Block common passwords
  const commonPasswords = ["password", "123456", "qwerty", "admin", "letmein", "password123"];
  if (commonPasswords.includes(password.toLowerCase())) {
    return { isValid: false, error: "Common/Weak password detected. Choose a more robust key." };
  }

  // No repeated characters (3 or more)
  if (/(.)\1\1/.test(password)) {
    return { isValid: false, error: "Repeated character sequences detected (e.g., 'aaa')." };
  }

  // No sequential characters (3 or more)
  const isSequential = (str: string) => {
    for (let i = 0; i < str.length - 2; i++) {
      const a = str.charCodeAt(i);
      const b = str.charCodeAt(i + 1);
      const c = str.charCodeAt(i + 2);
      if ((a + 1 === b && b + 1 === c) || (a - 1 === b && b - 1 === c)) return true;
    }
    return false;
  };

  if (isSequential(password)) {
    return { isValid: false, error: "Sequential character patterns detected (e.g., '123' or 'abc')." };
  }

  return { isValid: true };
}

