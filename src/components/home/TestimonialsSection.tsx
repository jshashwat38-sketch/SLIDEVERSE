"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getLangString } from "@/utils/lang";

export default function TestimonialsSection({ appearance, t, language, reviews, reviewRef }: any) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden bg-card">
      <div className="max-w-[1600px] w-[95%] mx-auto px-6 2xl:max-w-[1800px]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-left mb-16">
          <h2 
            className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter italic uppercase"
            dangerouslySetInnerHTML={{ __html: appearance?.testimonials?.heading || 'Client <span class="text-primary">Transmissions</span>' }}
          />
          <p className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-[0.4em] font-black">
            {appearance?.testimonials?.subtitle || 'Verified Intelligence from the Field'}
          </p>
        </motion.div>

        <div className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-6 pb-4 -mx-6 px-6 scrollbar-hide scroll-smooth" ref={reviewRef}>
          {reviews.map((testimonial: any, i: number) => (
            <div key={i} className="min-w-[85vw] snap-center bg-white/[0.03] backdrop-blur-sm p-12 rounded-[3.5rem] border border-white/5 relative flex flex-col justify-between min-h-[350px] shadow-2xl text-left">
              <div className="absolute top-10 right-10 text-primary/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-left">
                <div className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em] mb-8 leading-none">Feed // {testimonial.code}</div>
                <p className="text-zinc-300 text-lg leading-relaxed font-bold italic mb-8">
                  "{getLangString(testimonial.text, language)}"
                </p>
              </div>
              <div className="border-t border-white/5 pt-8 text-left">
                <div className="text-white font-bold text-sm uppercase tracking-widest leading-none">
                  {getLangString(testimonial.name, language)}
                </div>
                <div className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mt-3 leading-none">
                  {getLangString(testimonial.role, language)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:grid grid-cols-3 gap-8">
          {reviews.map((testimonial: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/5 relative group hover:border-primary/20 transition-all">
              <div className="absolute top-8 right-8 text-primary/20 group-hover:text-primary/40 transition-colors">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-zinc-600 text-[8px] font-bold uppercase tracking-[0.4em] mb-6">Encrypted Feed // {testimonial.code}</div>
              <p className="text-zinc-300 text-lg leading-relaxed font-medium italic mb-10">
                "{getLangString(testimonial.text, language)}"
              </p>
              <div className="border-t border-white/5 pt-8">
                <div className="text-white font-bold text-sm uppercase tracking-widest">
                  {getLangString(testimonial.name, language)}
                </div>
                <div className="text-primary text-[9px] font-bold uppercase tracking-[0.3em] mt-1">
                  {getLangString(testimonial.role, language)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
