"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto py-24 px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-[1px] bg-primary/40" />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">{t("about_us")}</span>
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-12 leading-[0.85]">{t("about")} <span className="text-primary">Slideverse</span></h1>
      
      <div className="bg-white/[0.02] p-12 lg:p-16 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        
        <p className="text-2xl md:text-3xl text-white font-black italic tracking-tighter mb-12 leading-tight border-l-4 border-primary pl-10 py-2">
          {t("about_welcome")}
        </p>
        
        <div className="space-y-8 text-zinc-400 text-lg font-medium leading-relaxed max-w-3xl">
          <p>
            {t("about_p1")}
          </p>
          <p>
            {t("about_p2")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5">
            <div className="text-primary font-black text-4xl mb-2 italic tracking-tighter">10k+</div>
            <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">{t("active_deployments")}</div>
          </div>
          <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5">
            <div className="text-primary font-black text-4xl mb-2 italic tracking-tighter">500+</div>
            <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">{t("elite_assets")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
