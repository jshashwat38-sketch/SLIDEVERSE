"use client";

import { motion } from "framer-motion";
import { Sparkles, Mail, Phone } from "lucide-react";
import { saveGrievance } from "@/actions/adminActions";
import { toast } from "react-hot-toast";

export default function ContactSection({ appearance, t }: any) {
  return (
    <section id="contact" className="scroll-mt-24 py-24 md:py-32 relative border-t border-white/5">
      <div className="w-[94%] max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-20">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">The Relay Hub</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-10 tracking-tighter italic uppercase leading-[0.9]">Establish <br /> <span className="text-primary">Contact</span></h2>
          
          <div className="space-y-10">
            <div className="flex items-center gap-6 group">
              <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className="w-14 h-14 md:w-16 md:h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </a>
              <div className="flex flex-col justify-center">
                <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-1 leading-none">Direct Relay</h3>
                <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className="text-base sm:text-lg md:text-xl text-white font-bold tracking-tight hover:text-primary transition-colors leading-tight break-all">{appearance?.contact?.email || "support@slideverse.pro"}</a>
              </div>
            </div>
            
            <div className="flex items-center gap-6 group">
              <a href={`tel:${(appearance?.contact?.mobile || "+91 8602328776").replace(/[^0-9+]/g, '')}`} className="w-14 h-14 md:w-16 md:h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110 active:scale-95 touch-manipulation">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </a>
              <div className="flex flex-col justify-center">
                <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-1 leading-none">Secure Line</h3>
                <a href={`tel:${(appearance?.contact?.mobile || "+91 8602328776").replace(/[^0-9+]/g, '')}`} className="text-lg md:text-xl text-white font-bold tracking-tight hover:text-primary transition-colors leading-tight touch-manipulation">{appearance?.contact?.mobile || "+91 8602328776"}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl p-8 md:p-12 lg:p-16 rounded-[3rem] md:rounded-[4rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32 pointer-events-none" />
            <form className="space-y-8 md:space-y-10 relative z-10" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                message: formData.get("message") as string
              };
              const res = await saveGrievance(data);
              if (res.success) {
                toast.success("Broadcast successful. Comms channel open.");
                (e.target as HTMLFormElement).reset();
              }
            }}>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] px-1">Identity Protocol</label>
                  <input name="name" type="text" required placeholder="ENTER NAME..." className="w-full bg-background/60 border border-white/10 rounded-xl px-6 py-4 text-foreground text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-background transition-all placeholder:text-zinc-400" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] px-1">Relay Endpoint</label>
                  <input name="email" type="email" required placeholder="ENTER EMAIL..." className="w-full bg-background/60 border border-white/10 rounded-xl px-6 py-4 text-foreground text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-background transition-all placeholder:text-zinc-400" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] px-1">Intelligence Data</label>
                <textarea name="message" required rows={5} placeholder="COMPOSE TRANSMISSION..." className="w-full bg-background/60 border border-white/10 rounded-xl px-6 py-4 text-foreground text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-background transition-all placeholder:text-zinc-400 resize-none"></textarea>
              </div>
              <button type="submit" className="group relative w-full py-6 md:py-8 bg-primary hover:bg-primary-hover text-white rounded-[1.5rem] transition-all duration-700 shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-white/20 overflow-hidden cursor-pointer">
                <div className="relative z-10 flex flex-col items-center justify-center text-white w-full px-6">
                  <span className="font-black text-sm sm:text-base md:text-xl uppercase tracking-[0.25em] block leading-tight text-center">Execute Broadcast</span>
                </div>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
