"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Send, Sparkles } from "lucide-react";
import { getLangString } from "@/utils/lang";

export default function HeroSection({ appearance, t, language, featuredProducts, handleScroll }: any) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <section className="relative pt-12 pb-16 flex items-center bg-white dark:bg-black transition-colors duration-500">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_95%_80%_at_50%_50%,#000_70%,transparent_100%)] lg:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[1600px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] lg:gap-[60px] gap-12 md:gap-20 items-center relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-left">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-white/5 backdrop-blur-xl text-primary font-bold px-5 py-2.5 rounded-xl mb-8 text-[9px] uppercase tracking-[0.4em] border border-zinc-200 dark:border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            {getLangString(appearance?.hero?.badge, language) || t("hero_badge")}
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-zinc-900 dark:text-white mb-8 leading-[1.1] tracking-tight italic uppercase"
            dangerouslySetInnerHTML={{ 
              __html: (getLangString(appearance?.hero?.title, language) || t("hero_title"))
                .replace(/Presentation Design/gi, '<span class="text-primary neon-text">Presentation Design</span>')
            }}
          />
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-lg leading-relaxed font-medium tracking-normal">
            {getLangString(appearance?.hero?.subtitle, language) || t("hero_subtitle")}
          </motion.p>
          
          <motion.div variants={itemVariants} className="hidden md:flex flex-col sm:flex-row items-center gap-6">
            <Link href={appearance?.buttons?.primary?.link || "/shop"} className="group relative w-full sm:w-auto">
              <button className="relative w-full sm:w-auto bg-primary hover:bg-zinc-900 dark:hover:bg-white text-black dark:hover:text-black hover:text-white px-10 py-5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 uppercase tracking-wider italic">
                {getLangString(appearance?.buttons?.primary?.label, language) || t("explore_collection")} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
            <Link href={appearance?.buttons?.secondary?.link || "/signin"} className="w-full sm:w-auto bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white px-10 py-5 rounded-xl font-bold text-base transition-all border border-zinc-200 dark:border-white/5 uppercase tracking-wider italic text-center">
              {getLangString(appearance?.buttons?.secondary?.label, language) || t("sign_in_securely")}
            </Link>
          </motion.div>

          {/* Mobile Command Hub */}
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-10 md:hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.4em]">{t("active_sectors")}</span>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-primary uppercase tracking-widest italic opacity-80">{t("online_status")}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: t("about"), icon: Shield, link: "/#about", code: "01" },
                { name: t("contact"), icon: Send, link: "/#contact", code: "02" },
                { name: t("vault"), icon: Sparkles, link: "/account", code: "03" }
              ].map((btn, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                  <a 
                    href={btn.link} 
                    onClick={(e) => handleScroll(e, btn.link)} 
                    className="w-full aspect-square flex flex-col items-center justify-center bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/10 rounded-[1.8rem] group active:scale-95 transition-all relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute top-2.5 left-2.5 text-[7px] font-black text-zinc-300 dark:text-zinc-500/20">{btn.code}</div>
                    <btn.icon className="w-5 h-5 text-primary mb-2" />
                    <span className="text-[9px] font-black text-zinc-900 dark:text-white uppercase tracking-widest italic text-center px-1 leading-tight">{btn.name}</span>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hidden lg:block relative group z-10 aspect-square w-full max-w-[750px] ml-auto overflow-hidden bg-transparent rounded-[2.5rem]"
        >
          {/* Background Ambient Layers: Subtle Glow Only */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>

          {/* Main Visual: Pure Floating with Cinematic Shadow */}
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-full h-full flex items-center justify-center overflow-hidden rounded-[2.5rem]"
            >
              <Image 
                src={appearance?.hero?.image || "/uploads/slideverse_presentation_hero.png"}
                alt="Hero Visual"
                width={800}
                height={800}
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] select-none rounded-[2.5rem] transition-transform duration-700"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
