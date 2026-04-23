"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { validateEmail } from "@/utils/validation";
import { verifyEmailDomain } from "@/actions/validationActions";
import PasswordInput from "@/components/common/PasswordInput";


export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { login, googleLogin, isLoading } = useAuth();
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

      <div className="bg-card p-12 md:p-16 rounded-[3rem] shadow-2xl border border-white/5 w-full max-w-lg relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-4 tracking-tighter italic uppercase">{t("welcome_back")}</h1>
          <p className="text-zinc-500 text-lg">{t("signin_subtitle")}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-5 rounded-2xl text-sm mb-8 border border-red-500/20 font-bold uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <div className="space-y-6 mb-12">
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-4 uppercase tracking-widest hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.71 1.7l3.54-3.54C18.11 1.21 15.28 0 12 0 7.33 0 3.3 2.69 1.3 6.65l4.23 3.28C6.51 7.21 9.01 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.27H12v4.51h6.47c-.28 1.48-1.13 2.74-2.4 3.58l3.71 2.88c2.16-1.99 3.42-4.93 3.42-8.7z" />
              <path fill="#FBBC05" d="M5.53 14.54c-.26-.77-.4-1.58-.4-2.54 0-.96.14-1.77.4-2.54L1.3 6.19C.47 7.9 0 9.89 0 12c0 2.11.47 4.1 1.3 5.81l4.23-3.27z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.71-2.88c-1.07.72-2.45 1.15-4.23 1.15-3.26 0-6.02-2.2-7.01-5.16l-4.23 3.28C3.31 21.31 7.33 24 12 24z" />
            </svg>
            Continue with Google
          </button>
          
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
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-white"
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
            className="w-full bg-primary hover:bg-primary-hover text-black py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_20px_rgba(197,165,114,0.3)] hover:shadow-[0_0_40px_rgba(197,165,114,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isLoading || isVerifying ? "..." : t("sign_in_securely")}
            {!isLoading && !isVerifying && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="mt-12 text-center text-sm font-black text-zinc-500 uppercase tracking-widest">
          Don't have an account? <a href="/signup" className="text-primary hover:underline">{t("create_account")}</a>
        </div>
      </div>
    </div>
  );
}
