import { Sparkles, Zap, Shield } from "lucide-react";

export default function StoryPage() {
  return (
    <div className="animate-in fade-in duration-700 max-w-5xl mx-auto py-24 px-6">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">The Genesis Record</span>
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-12 leading-[0.85]">Our <span className="text-primary">Legacy</span></h1>
      
      <div className="bg-white/[0.02] p-12 lg:p-16 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl relative overflow-hidden group mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-bl-full blur-3xl -z-10" />
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6">Born from a tactical need.</h2>
        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed font-medium italic border-l-2 border-primary/20 pl-10">
          In 2023, our founders were frustrated by the lack of high-quality, professional presentation frameworks that didn't look like they were built in the previous century. They decided to engineer the future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white/[0.02] p-12 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all group">
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-4">
            <Zap className="w-6 h-6 text-primary" /> The Friction
          </h3>
          <p className="text-zinc-500 leading-relaxed font-medium">
            Professionals spend countless hours tinkering with slide layouts instead of focusing on their core mission. The tools available were either too primitive or produced amateurish results.
          </p>
        </div>
        <div className="bg-white/[0.02] p-12 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all group">
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-4">
            <Shield className="w-6 h-6 text-primary" /> The Protocol
          </h3>
          <p className="text-zinc-500 leading-relaxed font-medium">
            Slideverse was created as a high-fidelity laboratory to provide a curated marketplace of premium, ready-to-use frameworks that command respect in any high-stakes environment.
          </p>
        </div>
      </div>
    </div>
  );
}
