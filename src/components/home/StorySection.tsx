"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { getLangString } from "@/utils/lang";

export default function StorySection({ appearance, t, language, pillarRef }: any) {
  return (
    <section className="py-24 md:py-40 bg-card/60 relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(197,165,114,0.05),transparent_50%)]" />
      <div className="max-w-[1600px] w-[95%] mx-auto px-6 2xl:max-w-[1800px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative lg:order-2">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-[4rem] opacity-50" />
            <img 
              src={appearance?.story?.image || "/assets/story_v2.png"} 
              alt="Creative Vision" 
              className="relative z-10 rounded-[3.5rem] border border-white/10 shadow-2xl hover:scale-[1.02] transition-all duration-700 animate-float" 
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:order-1 scroll-mt-24" id="story">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">The Genesis Project</span>
            </div>
            <h2 
              className="text-5xl md:text-7xl font-heading font-bold text-white mb-10 tracking-tighter italic uppercase leading-[0.85]"
              dangerouslySetInnerHTML={{ __html: getLangString(appearance?.story?.title, language) || `Beyond the <br /> <span class="text-primary">Standard</span>` }}
            />
            <p className="text-xl text-zinc-500 mb-12 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-8">
              {getLangString(appearance?.story?.subtitle, language) || "Elevating professional narratives into cinematic experiences of architectural clarity."}
            </p>

            <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <h4 className="text-2xl font-heading font-bold text-white mb-6 uppercase tracking-widest italic flex items-center gap-4">
                <Zap className="w-6 h-6 text-primary" /> Our Mission
              </h4>
              <p className="text-zinc-500 leading-relaxed text-lg font-medium">Slideverse was founded on a singular principle: that every idea of value deserves a medium of equal quality. We bridge the gap between complex intelligence and visual impact.</p>
            </div>
          </motion.div>
        </div>

        <div className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-4 pb-2 -mx-6 px-6 scrollbar-hide scroll-smooth" ref={pillarRef}>
          {[
            { title: "Architectural Integrity", desc: "Every slide is built on a foundation of structural perfection. We prioritize spatial balance and visual hierarchy." },
            { title: "Cinematic Motion", desc: "Transitions that bridge the gap between presentation and cinema." },
            { title: "Tactical Delivery", desc: "Engineered for high-stakes environments where clarity is paramount." }
          ].map((pillar, i) => (
            <div key={i} className="min-w-[80vw] snap-center p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 relative z-10">Pillar 0{i+1}</div>
              <h4 className="text-white font-bold text-2xl mb-4 italic uppercase tracking-tighter leading-tight relative z-10">{pillar.title}</h4>
              <p className="text-zinc-400 text-[13px] leading-relaxed font-medium relative z-10">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-3 gap-10">
          {[
            { title: "Architectural Integrity", desc: "Every slide is built on a foundation of structural perfection." },
            { title: "Cinematic Motion", desc: "Transitions that bridge the gap between presentation and cinema." },
            { title: "Tactical Delivery", desc: "Engineered for high-stakes environments where clarity is paramount." }
          ].map((pillar, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/30 transition-all text-center group">
              <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 group-hover:tracking-[0.6em] transition-all">Pillar 0{i+1}</div>
              <h4 className="text-white font-bold text-2xl mb-6 italic uppercase tracking-tighter">{pillar.title}</h4>
              <p className="text-zinc-500 text-base leading-relaxed font-medium">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
