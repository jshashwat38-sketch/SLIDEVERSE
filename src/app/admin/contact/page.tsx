"use client";

import { useState, useEffect } from "react";
import { getAppearance, updateAppearance } from "@/actions/adminActions";
import { Save, RefreshCw, Phone, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminContactPage() {
  const [appearance, setAppearance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getAppearance();
      setAppearance(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateAppearance(appearance);
      if (result.success) {
        toast.success("Contact protocols updated successfully.");
      } else {
        toast.error("Failed to update protocols.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Contact <span className="text-primary">Settings</span></h1>
          <p className="text-zinc-500 font-medium tracking-tight uppercase text-xs mt-2 italic">Configure official communication endpoints.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary-hover text-black px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(197,165,114,0.3)] disabled:opacity-50 uppercase tracking-widest italic"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Execute Update
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-card/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Email Endpoint</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Official Email</label>
              <input 
                value={appearance?.contact?.email || ""}
                onChange={(e) => setAppearance({...appearance, contact: {...(appearance.contact || {}), email: e.target.value}})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-primary transition-all"
                placeholder="support@slideverse.pro"
              />
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-2 ml-2 italic">This email will be displayed in the footer and contact pages.</p>
            </div>
          </div>
        </div>

        <div className="bg-card/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Voice Protocols</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Secure Mobile Line</label>
              <input 
                value={appearance?.contact?.mobile || ""}
                onChange={(e) => setAppearance({...appearance, contact: {...(appearance.contact || {}), mobile: e.target.value}})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-primary transition-all"
                placeholder="+91 99999 99999"
              />
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-2 ml-2 italic">Global contact number for customer support.</p>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="lg:col-span-2 bg-primary/5 border border-primary/10 p-8 rounded-3xl flex items-start gap-6">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1 italic">Synchronization Notice</h4>
            <p className="text-zinc-500 text-xs font-medium leading-relaxed uppercase tracking-tight">
              Changes made here are applied globally across all operational sectors of the Slideverse platform, including the customer-facing footer, contact relays, and legal documentation. ensure all endpoints are verified before execution.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
