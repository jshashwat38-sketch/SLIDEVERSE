"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck, RefreshCw, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { validateEmail, validatePassword } from "@/utils/validation";
import { verifyEmailDomain } from "@/actions/validationActions";
import { sendOTP, verifyOTP } from "@/actions/authActions";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import PasswordInput from "@/components/common/PasswordInput";
import PasswordRequirements from "@/components/auth/PasswordRequirements";


import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

type Step = "form" | "otp";

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { register } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("All fields are mandatory for security clearance.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Verify your credentials.");
      return;
    }

    const passValidation = validatePassword(formData.password);
    if (!passValidation.isValid) {
      setError(passValidation.error || "Weak access key detected.");
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || "Invalid Email");
      return;
    }

    setIsLoading(true);

    const serverValidation = await verifyEmailDomain(formData.email);
    if (!serverValidation.isValid) {
      setError(serverValidation.error || "Identity endpoint unreachable.");
      setIsLoading(false);
      return;
    }

    // Trigger OTP
    const res = await sendOTP(formData.email, 'signup');
    setIsLoading(false);

    if (res.success) {
      toast.success("Verification sequence dispatched.");
      setTimer(60);
      setStep("otp");
    } else {
      setError((res as any).error || "Failed to dispatch verification sequence.");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value.slice(-1);
    setOtpArray(newOtpArray);
    const combinedOtp = newOtpArray.join("");
    setOtp(combinedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    // 1. Verify OTP
    const otpRes = await verifyOTP(formData.email, otp);
    
    if (!otpRes.success) {
      setIsError(true);
      setError((otpRes as any).error || "Invalid verification sequence.");
      setIsLoading(false);
      setTimeout(() => setIsError(false), 500);
      return;
    }

    // 2. Finalize Registration
    const regRes = await register(formData);
    setIsLoading(false);

    if (regRes) {
      toast.success("Identity established successfully.");
      router.push("/signin?registered=true");
    } else {
      setError("Account initialization failed. Try again.");
    }
  };

  return (
    <div className="animate-in fade-in duration-700 min-h-[90vh] flex items-center justify-center py-16 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] -z-10" />

      <div className="bg-card p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl border border-white/5 w-full max-w-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Secure Registration Protocol</span>
                </div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-3 tracking-tighter italic uppercase">Create Identity</h1>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest italic">Join the elite curator network</p>
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-500 p-5 rounded-2xl text-[10px] mb-8 border border-red-500/20 font-black uppercase tracking-[0.15em] text-center flex items-center justify-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <div className="space-y-6 mb-10">
                <GoogleLoginButton label={t("register_with_google") || "Register with Google"} />
                
                <div className="flex items-center gap-4 text-zinc-800">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">OR INITIALIZE MANUALLY</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Full Identity Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white text-sm font-bold placeholder:text-zinc-400 dark:placeholder:text-zinc-800"
                      placeholder="ENTER FULL NAME"
                      required
                    />
                    <User className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Secure Endpoint (Email)</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white text-sm font-bold placeholder:text-zinc-400 dark:placeholder:text-zinc-800"
                      placeholder="YOU@SECURE.COM"
                      required
                    />
                    <Mail className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">Comm Link (Phone)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-4 bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all text-zinc-900 dark:text-white text-sm font-bold placeholder:text-zinc-400 dark:placeholder:text-zinc-800"
                      placeholder="+91..."
                      required
                    />
                    <Phone className="w-5 h-5 text-zinc-600 absolute left-5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PasswordInput
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      label="Access Key (Password)"
                      placeholder="••••••••"
                    />
                    <PasswordInput
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      label="Confirm Access Key"
                      placeholder="••••••••"
                    />
                  </div>
                  <PasswordRequirements password={formData.password} />
                </div>


                <div className="md:col-span-2 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-white text-black py-5 rounded-2xl font-black text-lg transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 italic"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        Initialize Account
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-[0_0_15px_rgba(197,165,114,0.1)]">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter mb-4">Security <span className="text-primary">Verification</span></h1>
                <p className="text-zinc-500 font-medium tracking-tight italic">Enter the 6-digit sequence sent to <span className="text-zinc-900 dark:text-white">{formData.email}</span></p>
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-500 p-5 rounded-2xl text-[10px] mb-8 border border-red-500/20 font-black uppercase tracking-[0.15em] text-center flex items-center justify-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <form onSubmit={handleVerifyAndRegister} className="space-y-10">
                <motion.div 
                  animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex justify-between gap-2"
                >
                  {otpArray.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-12 h-16 md:w-16 md:h-20 bg-white dark:bg-white/5 border rounded-2xl focus:bg-white dark:focus:bg-black focus:outline-none focus:ring-4 transition-all text-zinc-900 dark:text-white text-center text-3xl font-black ${
                          isError ? "border-red-500 ring-red-500/20" : "border-zinc-200 dark:border-white/10 focus:ring-primary/10 focus:border-primary/50"
                        }`}
                        required
                      />
                  ))}
                </motion.div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-primary hover:bg-primary-hover text-black py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 italic"
                >
                  {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : "Verify & Complete"}
                  {!isLoading && <ArrowRight className="w-6 h-6" />}
                </button>
              </form>

              <div className="flex flex-col gap-6">
                <button 
                  onClick={(e) => handleFormSubmit(e as any)}
                  disabled={timer > 0 || isLoading}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] text-center transition-colors ${
                    timer > 0 ? "text-zinc-700 cursor-not-allowed" : "text-primary hover:text-white"
                  }`}
                >
                  {timer > 0 ? `Resend available in ${timer}s` : "Did not receive? Resend Sequence"}
                </button>
                <button 
                  onClick={() => setStep("form")}
                  className="text-zinc-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] text-center flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Modify Registration Details
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
          Already verified? <a href="/signin" className="text-primary hover:underline italic">Return to Access</a>
        </div>
      </div>
    </div>
  );
}
