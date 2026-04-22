"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";

import { useState, useEffect } from "react";
import { getAppearance } from "@/actions/adminActions";

export default function ContactPage() {
  const [appearance, setAppearance] = useState<any>(null);

  useEffect(() => {
    getAppearance().then(setAppearance);
  }, []);

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto py-24 px-6">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-[1px] bg-primary/40" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Direct Frequency</span>
          <div className="w-12 h-[1px] bg-primary/40" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-none">Initiate <span className="text-primary">Contact</span></h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-10">Tactical Comms</h2>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <Mail className="w-6 h-6 text-primary group-hover:text-black" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1">Secure Relay</h3>
                  <p className="text-xl text-white font-bold tracking-tight">{appearance?.contact?.email || "slideversestudio@gmail.com"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <Phone className="w-6 h-6 text-primary group-hover:text-black" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-1">Direct Line</h3>
                  <p className="text-xl text-white font-bold tracking-tight">{appearance?.contact?.mobile || "+1 (800) SLIDEVERSE"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white/[0.02] p-10 lg:p-12 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32 pointer-events-none" />
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-10 relative z-10">Execute Broadcast</h2>
          <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] ml-4">Identity Code</label>
              <input type="text" className="w-full px-8 py-5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all placeholder:text-zinc-800" placeholder="ENTER NAME..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] ml-4">Relay Endpoint</label>
              <input type="email" className="w-full px-8 py-5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all placeholder:text-zinc-800" placeholder="ENTER EMAIL..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] ml-4">Mission Intelligence</label>
              <textarea rows={4} className="w-full px-8 py-5 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all placeholder:text-zinc-800 resize-none" placeholder="ENTER MESSAGE..."></textarea>
            </div>
            <button className="w-full bg-primary hover:bg-primary-hover text-black py-6 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(197,165,114,0.2)] hover:shadow-[0_0_60px_rgba(197,165,114,0.4)] uppercase tracking-widest italic">
              <Send className="w-6 h-6" />
              Execute Broadcast
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
