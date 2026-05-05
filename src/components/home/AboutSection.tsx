"use client";

import { motion } from "framer-motion";
import { getLangString } from "@/utils/lang";

export default function AboutSection({ appearance, t, language }: any) {
  return (
    <section id="about" className="scroll-mt-24 py-20 md:py-32 relative overflow-hidden">
      <div className="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative lg:w-[110%] -ml-[5%]">
          <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
          <div className="relative z-10 p-2 bg-gradient-to-br from-primary/20 to-transparent rounded-[3.2rem]">
            <img 
              src={appearance?.about?.image || "/assets/hero_v2.png"} 
              alt="Elite Workspace" 
              className="rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(197,165,114,0.1)] opacity-90 hover:opacity-100 transition-all duration-700 animate-float" 
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-primary/30" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Established Excellence</span>
          </div>
          <h2 
            className="text-5xl md:text-6xl font-heading font-bold text-white mb-8 tracking-tighter italic uppercase leading-[0.9]"
            dangerouslySetInnerHTML={{ 
              __html: (() => {
                const title = getLangString(appearance?.about?.title, language) || 'The Digital Atelier';
                const words = title.split(" ");
                if (words.length <= 1) return title;
                const half = Math.floor(words.length / 2);
                const firstHalf = words.slice(0, words.length - half).join(" ");
                const secondHalf = words.slice(words.length - half).join(" ");
                return `${firstHalf} <span class="text-primary">${secondHalf}</span>`;
              })()
            }}
          />
          <p className="text-xl text-zinc-400 mb-12 leading-relaxed font-medium italic border-l-2 border-primary/20 pl-8">
            {getLangString(appearance?.about?.description, language) || "We are a specialized laboratory of digital architects, dedicated to engineering the most sophisticated presentation frameworks in the modern era."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
              <div className="text-primary font-black text-3xl mb-2 tracking-tighter italic group-hover:scale-110 transition-transform origin-left">99.9%</div>
              <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Precision Engineering</div>
            </div>
            <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
              <div className="text-primary font-black text-3xl mb-2 tracking-tighter italic group-hover:scale-110 transition-transform origin-left">24/7</div>
              <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black leading-none">Tactical Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
