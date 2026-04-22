"use client";

import { useState } from "react";
import { Lock, ShieldCheck, RefreshCw, Save } from "lucide-react";
import PasswordInput from "@/components/common/PasswordInput";
import PasswordRequirements from "@/components/auth/PasswordRequirements";
import { validatePassword } from "@/utils/validation";
import { toast } from "react-hot-toast";

export default function AdminSecurityPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      toast.error(validation.error || "Key does not meet security protocols.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Keys do not match.");
      return;
    }

    setIsLoading(true);
    // Simulation for now, in a real app this would update a secure setting or environment variable
    setTimeout(() => {
      setIsLoading(false);
      toast.success("System Access Key updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    }, 1500);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Security <span className="text-primary">Ops</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight uppercase text-xs mt-2 italic">Manage administrative access keys and protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <form onSubmit={handleUpdateKey} className="bg-card/40 backdrop-blur-3xl p-10 md:p-14 rounded-[3.5rem] border border-white/5 relative overflow-hidden space-y-10">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(197,165,114,0.1)]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Update Access Key</h2>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">Authorized Personnel Only</p>
              </div>
            </div>

            <div className="space-y-8">
              <PasswordInput 
                label="New System Access Key"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="ENTER NEW KEY"
              />

              <PasswordRequirements password={newPassword} />

              <PasswordInput 
                label="Confirm New Key"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="RE-ENTER NEW KEY"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !newPassword}
              className="w-full bg-primary hover:bg-primary-hover text-black py-6 rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 flex items-center justify-center gap-4 uppercase tracking-widest disabled:opacity-50 italic"
            >
              {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              Commit Security Update
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Security Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Protocol Version</span>
                <span className="text-xs font-black text-white">v4.0.2-SECURE</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Last Updated</span>
                <span className="text-xs font-black text-white">23 APR 2026</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Encryption Level</span>
                <span className="text-xs font-black text-primary">AES-256-GCM</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem]">
            <p className="text-zinc-500 text-[10px] font-bold leading-relaxed uppercase tracking-widest italic">
              Warning: Updating the system access key will immediately terminate all active administrative sessions. Ensure you have the new key securely archived before committing changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
