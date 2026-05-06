"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard, HeroProductCard } from "@/components/products/ProductCards";
import { getLangString } from "@/utils/lang";

export default function FeaturedSection({ appearance, t, language, featuredProducts, activeHeroIndex, handleGridItemClick, isLoading, reviews }: any) {
  if (isLoading) {
    return (
      <section className="py-20 md:py-32 relative border-t border-white/5 animate-in fade-in duration-700">
        <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex flex-col items-center justify-center text-center gap-6">
          <div className="h-10 md:h-12 w-64 md:w-96 bg-white/5 rounded-full animate-pulse" />
          <div className="h-4 w-48 bg-white/5 rounded-full animate-pulse" />
          <div className="h-14 w-64 bg-white/5 rounded-2xl animate-pulse" />
        </div>
        <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="h-[500px] w-full bg-white/5 rounded-[3.5rem] animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-[2.5rem] animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) return null;

  return (
    <section id="featured" className="scroll-mt-24 py-20 md:py-32 relative border-t border-white/5">
      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 flex flex-col items-center justify-center text-center gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl">
          <h2 
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight italic uppercase" 
            dangerouslySetInnerHTML={{ 
              __html: (getLangString(appearance?.featured?.heading, language) || t("ppt_marketplace"))
                .replace(/Marketplace/gi, '<span class="text-primary">Marketplace</span>')
                .replace(/Featured/gi, '<span class="text-primary">Featured</span>')
            }} 
          />
          <p className="text-sm text-zinc-500 font-medium tracking-wide mb-8">
            {getLangString(appearance?.featured?.subtitle, language) || t("marketplace_subtitle")}
          </p>

          <Link href="/shop">
            <button className="bg-primary hover:bg-primary-hover text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:border-primary/40 transition-all cursor-pointer shadow-[0_15px_30px_rgba(197,165,114,0.3)] mx-auto group">
              <span>{t("view_full_collection")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
      
      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {featuredProducts[activeHeroIndex] && (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredProducts[activeHeroIndex].id}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
              >
                <HeroProductCard {...featuredProducts[activeHeroIndex]} reviews={reviews} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white italic">
              <span className="text-primary">{t("featured_additions")}</span>
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 items-stretch">
            {featuredProducts.slice(0, 12).map((product: any, index: number) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                className={`transition-all duration-500 rounded-[1.5rem] sm:rounded-[2.5rem] cursor-pointer h-full ${
                  index === activeHeroIndex 
                    ? "ring-2 ring-primary border border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(197,165,114,0.15)] scale-[1.02]" 
                    : "border border-transparent hover:border-white/5"
                }`}
                onClick={() => handleGridItemClick(index)}
              >
                <div className="hidden sm:block h-full">
                  <ProductCard {...product} reviews={reviews} />
                </div>
                <div className="block sm:hidden h-full">
                  <ProductCard {...product} variant="micro-grid-mobile" reviews={reviews} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
