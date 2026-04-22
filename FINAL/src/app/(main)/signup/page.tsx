"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { validateEmail } from "@/utils/validation";
import { verifyEmailDomain } from "@/actions/validationActions";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("All fields are mandatory for security clearance.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Verify your credentials.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters for robust protection.");
      return;
    }

    // 2. Email validation (Client-side)
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || "Invalid Email");
      return;
    }

    setIsVerifying(true);

    // 3. Email verification (Server-side)
    const serverValidation = await verifyEmailDomain(formData.email);
    if (!serverValidation.isValid) {
      setError(serverValidation.error || "Identity endpoint unreachable.");
      setIsVerifying(false);
      return;
    }

    // 4. Registration attempt
    try {
      // Assuming register function exists in useAuth, otherwise I'll need to mock it or update it
      const success = await register(formData);
      if (success) {
        router.push("/signin?registered=true");
      } else {
        setError("Registration failed. Endpoint may already be registered.");
      }
    } catch (err) {
      setError("A protocol error occurred. Try again later.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 min-h-[90vh] flex items-center justify-center py-16 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] -z-10" />

      <div className="bg-card p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-white/5 w-full max-w-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Secure Registration Protocol</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter italic uppercase">Create Identity</h1>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Join the elite curator network</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 text-red-500 p-5 rounded-2xl text-[10px] mb-8 border border-red-500/20 font-black uppercase tracking-[0.15em] text-center flex items-center justify-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-4">Full Identity Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white text-sm font-bold placeholder:text-zinc-800"
                placeholder="ENTER FULL NAME"
                required
              />
              <User className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-4">Secure Endpoint (Email)</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white text-sm font-bold placeholder:text-zinc-800"
                placeholder="YOU@SECURE.COM"
                required
              />
              <Mail className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-4">Comm Link (Phone)</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white text-sm font-bold placeholder:text-zinc-800"
                placeholder="+91..."
                required
              />
              <Phone className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-4">Access Key (Password)</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white text-sm font-bold placeholder:text-zinc-800"
                placeholder="••••••••"
                required
              />
              <Lock className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 ml-4">Confirm Access Key</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-white text-sm font-bold placeholder:text-zinc-800"
                placeholder="••••••••"
                required
              />
              <Lock className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={isLoading || isVerifying}
              className="w-full bg-primary hover:bg-white text-black py-5 rounded-2xl font-black text-lg transition-all shadow-[0_0_30px_rgba(212,255,0,0.2)] hover:shadow-[0_0_50px_rgba(212,255,0,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50"
            >
              {isLoading || isVerifying ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Initialize Account
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest">
          Already verified? <a href="/signin" className="text-primary hover:underline">Return to Access</a>
        </div>
      </div>
    </div>
  );
}
