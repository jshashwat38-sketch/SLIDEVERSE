"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCards";
import { getLangString } from "@/utils/lang";

export default function BestsellersSection({ appearance, t, language, bestsellers }: any) {
  if (!bestsellers || bestsellers.length === 0) return null;

  return (
    <section className="py-20 md:py-32 relative border-t border-white/5">
      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center mb-16 gap-2">
          <h3 
            className="text-3xl md:text-5xl font-heading font-bold text-white uppercase tracking-tighter italic"
            dangerouslySetInnerHTML={{ 
              __html: getLangString(appearance?.bestsellers?.heading, language) || `Our <span class="text-primary">Bestsellers</span>`
            }}
          />
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2">
            {getLangString(appearance?.bestsellers?.subtitle, language) || "Most Loved Templates by Our Customers"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-7 lg:gap-8">
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
              <div className="block sm:hidden">
                <ProductCard {...product} variant="micro-grid-mobile" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
