"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCards";
import { getLangString, renderDualToneTitle } from "@/utils/lang";

export default function BestsellersSection({ appearance, t, language, bestsellers, isLoading }: any) {
  if (isLoading) {
    return (
      <section className="py-20 md:py-32 relative border-t border-white/5 animate-in fade-in duration-700">
        <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center mb-16 gap-4">
            <div className="h-10 md:h-12 w-64 md:w-96 bg-white/5 rounded-full animate-pulse" />
            <div className="h-3 w-48 bg-white/5 rounded-full animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-white/5 rounded-[2rem] animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bestsellers || bestsellers.length === 0) return null;

  return (
    <section className="py-20 md:py-32 relative border-t border-white/5">
      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-16 gap-2">
          <h3 
            className="text-3xl md:text-5xl font-heading font-bold text-white uppercase tracking-tighter italic"
            dangerouslySetInnerHTML={{ 
              __html: renderDualToneTitle(getLangString(appearance?.bestsellers?.heading, language) || t?.bestsellers_title || "Our Bestsellers")
            }}
          />
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2">
            {getLangString(appearance?.bestsellers?.subtitle, language) || "Most Loved Templates by Our Customers"}
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-7 lg:gap-8">
          {bestsellers.slice(0, 24).map((product: any, index: number) => (
            <motion.div 
              key={`best-${product.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 4) * 0.05, duration: 0.6 }}
            >
              <div className="hidden sm:block">
                <ProductCard {...product} />
              </div>
              <div className="block sm:hidden h-full">
                <ProductCard {...product} variant="micro-grid-mobile" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
