"use client";

import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  ChevronRight, 
  Zap, 
  ShieldCheck, 
  Star,
  Package,
  ArrowRight,
  FileText,
  Files,
  Target,
  CheckCircle2 as CheckCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function BundleDetailClient({ bundle }: { bundle: any }) {
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const title = bundle.title || {};
  const items = title.bundle_items || [];
  
  const handleAddToCart = () => {
    addToCart({
      id: bundle.id,
      title: title.en || "Premium Bundle",
      price: bundle.price,
      imageUrl: bundle.image_url
    });
    toast.success("Added to your vault!");
  };

  const savings = title.mrp ? Math.round(((title.mrp - bundle.price) / title.mrp) * 100) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-primary selection:text-black">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Premium Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] blur-2xl group-hover:scale-105 transition-transform duration-700" />
              <div className="relative h-full w-full rounded-[3rem] overflow-hidden bg-white dark:bg-black transition-colors duration-300">
                <Image 
                  src={bundle.image_url || "/placeholder.jpg"} 
                  alt={title.en}
                  fill
                  priority
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                {savings > 0 && (
                  <div className="absolute top-8 left-8 bg-primary text-black font-black px-6 py-2 rounded-full text-sm uppercase tracking-tighter shadow-xl italic">
                    Save {savings}%
                  </div>
                )}
                {title.is_bestseller && (
                  <div className="absolute top-8 right-8 bg-black/80 backdrop-blur-md text-primary border border-primary/30 font-black px-6 py-2 rounded-full text-xs uppercase tracking-[0.2em] italic">
                    <Star className="w-3 h-3 inline-block mr-2 fill-primary" /> Bestseller
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Asset Intelligence */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[2px] bg-primary" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Elite Collection Bundle</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                  {title.en}
                </h1>
                <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-[10px] leading-relaxed italic">
                  {title.short_description || "Premium presentation architecture for high-stakes environments."}
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">Valuation</span>
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl font-black italic tracking-tighter text-white">₹{bundle.price}</span>
                    {title.mrp && (
                      <span className="text-2xl text-zinc-700 line-through font-bold decoration-primary/40 decoration-2 italic tracking-tighter">₹{title.mrp}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary-hover text-black px-10 py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(197,165,114,0.3)]"
                >
                  <ShoppingBag className="w-5 h-5" /> Acquire Bundle
                </button>
                <Link 
                  href="/cart"
                  className="px-10 py-5 rounded-[2rem] border border-white/10 hover:border-primary/50 text-white font-black flex items-center justify-center gap-3 transition-all hover:bg-primary/5 uppercase tracking-widest text-xs"
                >
                  View Vault <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-white uppercase tracking-widest">Instant</span>
                    <span className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Deployment</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-white uppercase tracking-widest">Premium</span>
                    <span className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Authorization</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Intelligence Panel */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-[1px] bg-primary/30" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">Bundle Intelligence Panel</span>
          </div>

          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-[2rem] mb-12 max-w-4xl mx-auto">
            {[
              { id: 'description', label: 'Overview', icon: FileText },
              { id: 'included', label: 'Inside the Box', icon: Package },
              { id: 'advantages', label: 'Advantages', icon: Zap },
              { id: 'usecases', label: 'Use Cases', icon: Target },
              { id: 'files', label: 'Included Files', icon: Files }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              // Visibility logic
              if (tab.id === 'included' && items.length === 0) return null;
              if (tab.id === 'advantages' && !title.why_buy?.length) return null;
              if (tab.id === 'usecases' && !title.use_cases?.length && !title.target_audience?.length) return null;
              if (tab.id === 'files' && !bundle.description?.included_files?.length) return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 shrink-0 ${
                    isActive 
                    ? 'bg-primary text-black font-black shadow-[0_0_20px_rgba(197,165,114,0.3)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5 font-bold'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-600'}`} />
                  <span className="text-[10px] uppercase tracking-widest">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-8 sm:p-16 min-h-[500px] relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                {/* 1. Overview Tab */}
                {activeTab === 'description' && (
                  <div className="max-w-4xl mx-auto text-center space-y-10">
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Intellectual Narrative</h4>
                    <p className="text-2xl md:text-4xl font-medium leading-[1.4] text-zinc-400 italic">
                      {bundle.description?.en || "Strategic presentation architecture designed for high-stakes professional environments."}
                    </p>
                  </div>
                )}

                {/* 2. Inside the Box Tab (PPT items) */}
                {activeTab === 'included' && (
                  <div className="space-y-12">
                    <div className="flex justify-between items-center mb-8">
                      <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Included Assets ({items.length})</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {items.map((item: Record<string, any>, idx: number) => (
                        <div key={idx} className="group/card bg-black/40 border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/20 transition-all duration-500">
                          <div className="aspect-[9/16] relative overflow-hidden bg-zinc-900">
                            <Image 
                              src={item.image || "/placeholder.jpg"} 
                              alt={item.name}
                              fill
                              className="object-cover opacity-60 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700"
                            />
                          </div>
                          <div className="p-6 space-y-3">
                            <h5 className="text-lg font-black uppercase italic tracking-tighter text-white">{item.name}</h5>
                            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest line-clamp-2">{item.description}</p>
                            <Link href={`/product/${item.product_id}`} className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest mt-4 group/link">
                              View Details <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Advantages Tab */}
                {activeTab === 'advantages' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Strategic Advantages</h4>
                      <div className="space-y-4">
                        {(title.why_buy || []).map((point: string, i: number) => (
                          <div key={i} className="flex gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group/adv">
                            <CheckCircle className="w-5 h-5 text-primary shrink-0 opacity-40 group-hover/adv:opacity-100 transition-opacity" />
                            <span className="text-xs font-bold text-zinc-400 group-hover/adv:text-white transition-colors">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-primary/5 rounded-[2.5rem] border border-primary/10 p-12 flex flex-col items-center justify-center text-center space-y-6">
                      <Zap className="w-12 h-12 text-primary animate-pulse" />
                      <h5 className="text-xl font-black uppercase italic tracking-tighter">Instant Efficiency Boost</h5>
                      <p className="text-sm text-zinc-500 font-medium italic">Save over 200+ hours of design work with this cohesive professional ecosystem.</p>
                    </div>
                  </div>
                )}

                {/* 4. Use Cases Tab */}
                {activeTab === 'usecases' && (
                  <div className="space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Strategic Scenarios</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {(title.use_cases || []).map((scenario: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                              <Target className="w-5 h-5 text-primary opacity-60" />
                              <span className="text-xs font-black text-white uppercase tracking-widest">{scenario}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Target Audience</h4>
                        <div className="flex flex-wrap gap-3">
                          {(title.target_audience || []).map((audience: string, i: number) => (
                            <span key={i} className="px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                              {audience}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Included Files Tab */}
                {activeTab === 'files' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(bundle.description?.included_files || []).map((file: string, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-primary/20 transition-all">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                          <Files className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">{file}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 text-center relative">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
             <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Deploy Your <span className="text-primary">Intelligence</span>
            </h2>
            <p className="text-zinc-500 font-medium uppercase tracking-[0.3em] text-xs italic">
              Join the elite circle of professional presenters today.
            </p>
          </div>
          <div className="flex justify-center gap-6">
            <button 
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary-hover text-black px-12 py-6 rounded-[2.5rem] font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm shadow-[0_0_50px_rgba(197,165,114,0.2)]"
            >
              Acquire Complete Bundle
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-8 left-4 right-4 md:hidden z-50">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-primary text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform uppercase tracking-widest text-[10px]"
        >
          <ShoppingBag className="w-4 h-4" /> Acquisition Ready — ₹{bundle.price}
        </button>
      </div>
    </div>
  );
}
