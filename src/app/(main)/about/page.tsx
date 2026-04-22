// src/app/(main)/about/page.tsx
import { Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto py-24 px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-[1px] bg-primary/40" />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Intelligence Briefing</span>
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-12 leading-[0.85]">About <span className="text-primary">Slideverse</span></h1>
      
      <div className="bg-white/[0.02] p-12 lg:p-16 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        
        <p className="text-2xl md:text-3xl text-white font-black italic tracking-tighter mb-12 leading-tight border-l-4 border-primary pl-10 py-2">
          Welcome to the world's premier destination for professional presentation frameworks.
        </p>
        
        <div className="space-y-8 text-zinc-400 text-lg font-medium leading-relaxed max-w-3xl">
          <p>
            At Slideverse, we believe that every great idea deserves an incredible presentation. We are dedicated to providing professionals, educators, and entrepreneurs with the highest quality digital assets to make their messages stand out.
          </p>
          <p>
            Whether you are delivering a keynote speech, pitching to investors, or running a team meeting, our meticulously crafted templates ensure you command authority and engage your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5">
            <div className="text-primary font-black text-4xl mb-2 italic tracking-tighter">10k+</div>
            <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Active Deployments</div>
          </div>
          <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/5">
            <div className="text-primary font-black text-4xl mb-2 italic tracking-tighter">500+</div>
            <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Elite Assets</div>
          </div>
        </div>
      </div>
    </div>
  );
}
