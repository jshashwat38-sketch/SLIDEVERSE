"use client";

import { Sparkles, Zap, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function StoryPage() {
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto py-24 px-6">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">{t("our_story")}</span>
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-12 leading-[0.85]">{t("our_story")}</h1>
      
      <div className="bg-white/[0.02] p-12 lg:p-16 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-bl-full blur-3xl -z-10" />
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6">{t("born_need")}</h2>
        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-medium italic border-l-2 border-primary/20 pl-10">
          {t("born_need_desc")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white/[0.02] p-12 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all group">
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-4">
            <Zap className="w-6 h-6 text-primary" /> {t("the_problem")}
          </h3>
          <p className="text-zinc-500 leading-relaxed font-medium">
            {t("the_problem_desc")}
          </p>
        </div>
        <div className="bg-white/[0.02] p-12 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all group">
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-4">
            <Shield className="w-6 h-6 text-primary" /> {t("the_solution")}
          </h3>
          <p className="text-zinc-500 leading-relaxed font-medium">
            {t("the_solution_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
