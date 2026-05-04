"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { validateEmail } from "@/utils/validation";
import { verifyEmailDomain } from "@/actions/validationActions";
import PasswordInput from "@/components/common/PasswordInput";


import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  
  const redirectUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('redirect') : '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // 1. Basic check
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // 2. Client-side validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || "Invalid Email");
      return;
    }

    setIsVerifying(true);

    // 3. Server-side verification (MX records)
    const serverValidation = await verifyEmailDomain(email);
    if (!serverValidation.isValid) {
      setError(serverValidation.error || "Email verification failed.");
      setIsVerifying(false);
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      setIsVerifying(false);
      return;
    }

    const success = await login(email, password);
    setIsVerifying(false);
    if (success) {
      router.push(redirectUrl || "/");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-[70vh] flex items-center justify-center py-12 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="bg-card p-6 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-white/5 w-full max-w-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-4 tracking-tighter italic uppercase">{t("welcome_back")}</h1>
          <p className="text-zinc-500 text-lg">{t("signin_subtitle")}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-5 rounded-2xl text-sm mb-8 border border-red-500/20 font-bold uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <div className="space-y-6 mb-12">
          <GoogleLoginButton label={t("continue_with_google") || "Continue with Google"} />
          
          <div className="flex items-center gap-4 text-zinc-800">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">OR SECURE MANUAL ACCESS</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">{t("email_address")}</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-zinc-900 dark:text-white"
                placeholder="YOU@EXAMPLE.COM"
                required
              />
              <Mail className="w-6 h-6 text-zinc-500 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            </div>
          </div>

          <div>
            <div className="flex justify-end mb-3">
              <a href="/forgot-password" className="text-xs font-black text-primary hover:text-primary-hover transition-all uppercase tracking-widest">Forgot?</a>
            </div>

          <PasswordInput
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label={t("password")}
            placeholder="••••••••"
          />


          </div>

          <button
            type="submit"
            disabled={isLoading || isVerifying}
            className="group relative w-full bg-primary hover:bg-primary-hover text-black py-5 rounded-2xl font-black text-xl transition-all duration-300 shadow-[0_0_20px_rgba(197,165,114,0.3)] hover:shadow-[0_0_40px_rgba(197,165,114,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest overflow-hidden disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {/* Background Shimmer */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.2),transparent)] bg-[length:200%_100%] animate-[shimmer_3s_infinite] pointer-events-none" />
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[rgba(255,255,255,0.1)] transition-opacity duration-300 pointer-events-none" />

            <span className="relative z-10 flex items-center gap-3">
              {isLoading || isVerifying ? "..." : t("sign_in_securely")}
              {!isLoading && !isVerifying && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />}
            </span>
          </button>
        </form>

        <div className="mt-12 text-center text-sm font-black text-zinc-500 uppercase tracking-widest">
          Don't have an account? <a href="/signup" className="text-primary hover:underline">{t("create_account")}</a>
        </div>
      </div>
    </div>
  );
}
