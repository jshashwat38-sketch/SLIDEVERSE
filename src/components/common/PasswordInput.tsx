"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  required?: boolean;
}

export default function PasswordInput({ name, value, onChange, placeholder = "••••••••", label, required = true }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <label className="block text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">{label}</label>
      <div className="relative group">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-14 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-white placeholder:text-zinc-800"
          placeholder={placeholder}
          required={required}
        />
        <Lock className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors p-1"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
