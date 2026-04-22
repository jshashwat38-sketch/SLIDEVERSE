"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, Lock, ArrowRight, ChevronLeft, RefreshCw, CheckCircle2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { validateEmail, validatePassword } from "@/utils/validation";
import { sendOTP, verifyOTP, resetPassword } from "@/actions/authActions";
import { toast } from "react-hot-toast";
import PasswordInput from "@/components/common/PasswordInput";
import PasswordRequirements from "@/components/auth/PasswordRequirements";



type Step = "email" | "otp" | "reset" | "success";

const STEPS: { id: Step; label: string }[] = [
  { id: "email", label: "Identity" },
  { id: "otp", label: "Verify" },
  { id: "reset", label: "Secure" },
  { id: "success", label: "Finish" },
];

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [isError, setIsError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    return strength;
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (timer > 0 && step === "otp") return;

    setIsLoading(true);
    const res = await sendOTP(email);
    setIsLoading(false);
    
    if (res.success) {
      toast.success((res as any).message || "Authorization sequence dispatched");
      setTimer(60);
      setStep("otp");
    } else {
      toast.error((res as any).error || "System failure during dispatch");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    
    setIsLoading(true);
    setIsError(false);
    const res = await verifyOTP(email, otp);
    setIsLoading(false);
    
    if (res.success) {
      setStep("reset");
    } else {
      setIsError(true);
      toast.error((res as any).error || "Invalid OTP");
      setTimeout(() => setIsError(false), 500);
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const passValidation = validatePassword(newPassword);
    if (!passValidation.isValid) {
      toast.error(passValidation.error || "Weak access key.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Keys do not match.");
      return;
    }

    setIsLoading(true);
    const res = await resetPassword(email, otp, newPassword);
    setIsLoading(false);
    
    if (res.success) {
      setStep("success");
    } else {
      toast.error((res as any).error || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="bg-card w-full max-w-lg rounded-[3rem] shadow-2xl border border-white/5 relative overflow-hidden p-10 md:p-14">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        {/* Step Indicator */}
        {step !== "success" && (
          <div className="flex justify-between mb-12 relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 -z-10" />
            {STEPS.map((s, idx) => {
              const isActive = s.id === step;
              const isPast = STEPS.findIndex(st => st.id === step) > idx;
              return (
                <div key={s.id} className="flex flex-col items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${
                    isActive ? "bg-primary text-black scale-125 shadow-[0_0_15px_rgba(197,165,114,0.5)]" : 
                    isPast ? "bg-green-500/20 text-green-500 border border-green-500/30" : 
                    "bg-zinc-900 text-zinc-600 border border-white/5"
                  }`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[8px] uppercase font-black tracking-widest ${isActive ? "text-primary" : "text-zinc-600"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-[0_0_15px_rgba(197,165,114,0.1)]">
                  <Mail className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Forgot <span className="text-primary">Vault</span> Key</h1>
                <p className="text-zinc-500 font-medium tracking-tight">Enter your identity email to receive an authorization OTP.</p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Registered Email</label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="IDENTITY@SLIDEVERSE.PRO"
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-white placeholder:text-zinc-700"
                      required
                    />
                    <Mail className="w-6 h-6 text-zinc-500 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-black py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 italic"
                >
                  {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : "Dispatch OTP"}
                  {!isLoading && <ArrowRight className="w-6 h-6" />}
                </button>
              </form>

              <button 
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 text-zinc-600 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]"
              >
                <ChevronLeft className="w-4 h-4" />
                Return to Login
              </button>
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
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Security <span className="text-primary">Verification</span></h1>
                <p className="text-zinc-500 font-medium tracking-tight">Enter the 6-digit sequence sent to <span className="text-white">{email}</span></p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-10">
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
                      className={`w-12 h-16 md:w-16 md:h-20 bg-white/5 border rounded-2xl focus:bg-black focus:outline-none focus:ring-4 transition-all text-white text-center text-3xl font-black ${
                        isError ? "border-red-500 ring-red-500/20" : "border-white/10 focus:ring-primary/10 focus:border-primary/50"
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
                  {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : "Verify Identity"}
                  {!isLoading && <ArrowRight className="w-6 h-6" />}
                </button>
              </form>

              <div className="flex flex-col gap-6">
                <button 
                  onClick={handleSendOTP}
                  disabled={timer > 0 || isLoading}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] text-center transition-colors ${
                    timer > 0 ? "text-zinc-700 cursor-not-allowed" : "text-primary hover:text-white"
                  }`}
                >
                  {timer > 0 ? `Resend available in ${timer}s` : "Did not receive? Resend Sequence"}
                </button>
                <button 
                  onClick={() => setStep("email")}
                  className="text-zinc-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] text-center"
                >
                  Change Email Address
                </button>
              </div>
            </motion.div>
          )}

          {step === "reset" && (
            <motion.div
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-[0_0_15px_rgba(197,165,114,0.1)]">
                  <Lock className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Reset <span className="text-primary">Credentials</span></h1>
                <p className="text-zinc-500 font-medium tracking-tight">Identity verified. Update your vault access key.</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-8">
                <div className="space-y-6">
                  <PasswordInput
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    label="New Vault Key"
                    placeholder="••••••••"
                  />
                  
                  <PasswordRequirements password={newPassword} />
                  
                  <div className="space-y-2">
                    <PasswordInput
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      label="Confirm Key"
                      placeholder="••••••••"
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <div className="flex items-center gap-1 text-[8px] font-black text-red-500 uppercase tracking-widest ml-4">
                        <ShieldAlert className="w-3 h-3" />
                        Keys do not match
                      </div>
                    )}
                  </div>
                </div>




                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-black py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 italic"
                >
                  {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : "Commit Changes"}
                  {!isLoading && <ArrowRight className="w-6 h-6" />}
                </button>
              </form>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-10"
            >
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <CheckCircle2 className="w-14 h-14 text-green-500" />
              </div>
              
              <div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Vault <span className="text-green-500">Secured</span></h1>
                <p className="text-zinc-500 font-medium tracking-tight">Your credentials have been successfully updated. You may now access the platform.</p>
              </div>

              <button
                onClick={() => router.push("/signin")}
                className="w-full bg-white hover:bg-zinc-200 text-black py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest italic"
              >
                Return to Login
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
