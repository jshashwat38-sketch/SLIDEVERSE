"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Requirement {
  label: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements: Requirement[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One numerical digit", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[!@#$%^&*]/.test(password) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
      {requirements.map((req, i) => (
        <div key={i} className="flex items-center gap-3">
          <div 
            className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${
              req.met 
                ? "bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" 
                : "bg-white/5 border-white/10"
            }`}
          >
            {req.met && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Check className="w-3 h-3 text-black stroke-[4px]" />
              </motion.div>
            )}
          </div>
          <span 
            className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
              req.met ? "text-green-500" : "text-white/20"
            }`}
          >
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
}
