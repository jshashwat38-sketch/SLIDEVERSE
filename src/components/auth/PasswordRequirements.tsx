"use client";

import { Check, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Requirement {
  id: string;
  label: string;
  test: (pass: string) => boolean;
}

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements: Requirement[] = [
    { id: "length", label: "8–64 Characters", test: (p) => p.length >= 8 && p.length <= 64 },
    { id: "upper", label: "Uppercase Letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { id: "lower", label: "Lowercase Letter (a-z)", test: (p) => /[a-z]/.test(p) },
    { id: "number", label: "Numerical Digit (0-9)", test: (p) => /[0-9]/.test(p) },
    { id: "special", label: "Special Character (!@#$%)", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  // Silent Rules Validation for Error Message
  const [silentError, setSilentError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!password) {
      setSilentError(null);
      return;
    }

    // 1. Common Passwords
    const common = ["password", "123456", "qwerty", "admin", "letmein"];
    if (common.includes(password.toLowerCase())) {
      setSilentError("PROHIBITED: Common password pattern detected.");
      return;
    }

    // 2. Repeated Chars (3+)
    if (/(.)\1\1/.test(password)) {
      setSilentError("PROHIBITED: Repeated character sequences detected.");
      return;
    }

    // 3. Sequential Chars (3+)
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
      setSilentError("PROHIBITED: Sequential character patterns detected.");
      return;
    }

    setSilentError(null);
  }, [password]);

  // Strength Calculation
  const calculateStrength = () => {
    if (!password) return { label: "Empty", color: "bg-zinc-800", width: "0%" };
    const metCount = requirements.filter(r => r.test(password)).length;
    if (metCount <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (metCount <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = calculateStrength();

  return (
    <div className="space-y-6">
      {/* Strength Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Signal Strength</span>
          <span className={`text-[10px] font-black uppercase tracking-widest ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: strength.width }}
            className={`h-full ${strength.color} shadow-[0_0_10px_currentColor] transition-all duration-500`}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {requirements.map((req) => {
          const isMet = req.test(password);
          return (
            <div key={req.id} className="flex items-center gap-3 group">
              <div 
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${
                  isMet 
                    ? "bg-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                    : "bg-white/5 border-white/10"
                }`}
              >
                {isMet && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                  >
                    <Check className="w-3 h-3 text-black stroke-[4px]" />
                  </motion.div>
                )}
              </div>
              <span 
                className={`text-[9px] uppercase tracking-widest transition-all duration-500 ${
                  isMet ? "text-green-500 font-bold" : "text-white/20 font-medium"
                }`}
              >
                {req.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Silent Rules Error Message */}
      <AnimatePresence>
        {silentError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
          >
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest italic">{silentError}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
