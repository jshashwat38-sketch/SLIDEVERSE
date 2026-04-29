"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CategoryShowcase({ products, categories, language, t }: { products: any[]; categories: any[]; language: string; t: any }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<any | null>(null);
  const [activeMobilePopup, setActiveMobilePopup] = useState<any | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  const filtered = products.filter(p => p.category_id === selectedCategoryId).slice(0, 20);
  const selectedCat = categories.find(c => c.id === selectedCategoryId);
  const selectedCatName = selectedCat ? (typeof selectedCat.title === 'object' ? (selectedCat.title[language] || selectedCat.title.en) : selectedCat.title) : "";

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 400;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-24 border-t border-white/5 relative bg-[#040405]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Headings */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white italic uppercase tracking-tighter">
            Templates to transform your <span className="text-primary neon-text">business and career</span>
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em] mt-3">
            Browse premium presentations by category.
          </p>
        </div>

        {/* Clickable Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => {
            const catName = typeof cat.title === 'object' ? (cat.title[language] || cat.title.en) : cat.title;
            const isActive = cat.id === selectedCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all cursor-pointer border ${isActive ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(197,165,114,0.3)]' : 'bg-white/5 text-zinc-400 border-white/5 hover:border-white/10 hover:text-white'}`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {/* Horizontal Slider container */}
        <div className="relative group/slider mb-10">
          {/* Slider buttons (Desktop) */}
          <button
            onClick={() => scrollSlider('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl cursor-pointer hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollSlider('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl cursor-pointer hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Flex */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none select-none pb-8"
          >
            {filtered.length === 0 ? (
              <div className="w-full text-center py-16 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> No presentations uploaded to this shelf yet.
                </span>
              </div>
            ) : (
              filtered.map((prod) => {
                const titleStr = typeof prod.title === 'object' ? (prod.title[language] || prod.title.en) : prod.title;
                const descStr = typeof prod.description === 'object' ? (prod.description[language] || prod.description.en) : prod.description;
                const isBestseller = typeof prod.title === 'object' && prod.title?.is_bestseller;
                const mrp = typeof prod.title === 'object' ? Number(prod.title?.mrp || 0) : Number(prod.mrp || 0);

                return (
                  <div
                    key={prod.id}
                    className="snap-start shrink-0 w-[45%] md:w-[30%] lg:w-[23%] relative"
                    onMouseEnter={() => setHoveredProduct(prod)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setActiveMobilePopup(prod);
                      }
                    }}
                  >
                    <div className="bg-[#09090B] border border-white/5 rounded-3xl overflow-hidden h-full flex flex-col hover:border-primary/20 transition-all duration-500">
                      <Link href={`/product/${prod.id}`} className="block h-40 bg-black overflow-hidden relative cursor-pointer">
                        <img
                          src={prod.image_url || "https://placehold.co/400x300"}
                          alt={titleStr}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        {isBestseller && (
                          <div className="absolute top-3 left-3 bg-primary text-black font-black text-[8px] px-2 py-0.5 rounded uppercase">
                            Bestseller
                          </div>
                        )}
                      </Link>

                      <div className="p-4 flex flex-col flex-1">
                        <Link href={`/product/${prod.id}`}>
                          <h3 className="text-xs sm:text-sm font-black text-white uppercase italic tracking-tight line-clamp-1 hover:text-primary cursor-pointer">{titleStr}</h3>
                        </Link>
                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1">{selectedCatName}</p>

                        <div className="mt-auto pt-4 flex items-center gap-2">
                          <span className="text-xs text-primary font-black font-mono">₹{prod.price}</span>
                          {mrp > prod.price && (
                            <span className="text-[10px] text-zinc-600 line-through font-bold font-mono">₹{mrp}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Hover Floating Details */}
                    <AnimatePresence>
                      {hoveredProduct?.id === prod.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl p-6 z-50 select-none pointer-events-auto"
                        >
                          <div className="text-xs font-black text-white uppercase mb-2 line-clamp-1">{titleStr}</div>
                          <div className="text-[10px] text-zinc-400 leading-relaxed mb-4 line-clamp-3">{descStr || "Professional slide layouts."}</div>

                          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-primary" /> Multi-layout support
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart({ id: prod.id, title: titleStr, price: prod.price, imageUrl: prod.image_url });
                              router.push("/cart");
                            }}
                            className="w-full bg-primary hover:bg-primary-hover text-black font-black text-xs py-2.5 rounded-xl uppercase tracking-wider cursor-pointer transition-all shadow-lg text-center"
                          >
                            {t("buy_now")}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic Show All Button */}
        {filtered.length > 0 && (
          <div className="text-center">
            <Link href={`/shop?category=${selectedCategoryId}`}>
              <button className="bg-white/5 hover:bg-white/10 text-white hover:text-primary border border-white/10 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto cursor-pointer transition-all">
                <span>Show all {selectedCatName} PPTs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet Popup */}
      <AnimatePresence>
        {activeMobilePopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMobilePopup(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[#0B0B0C] border-t border-white/10 rounded-t-[2rem] p-6 z-[101] md:hidden"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" onClick={() => setActiveMobilePopup(null)} />
              
              <div className="text-lg font-black text-white uppercase italic mb-2">
                {typeof activeMobilePopup.title === 'object' ? (activeMobilePopup.title[language] || activeMobilePopup.title.en) : activeMobilePopup.title}
              </div>
              <div className="text-xs text-zinc-400 mb-6 leading-relaxed">
                {typeof activeMobilePopup.description === 'object' ? (activeMobilePopup.description[language] || activeMobilePopup.description.en) : activeMobilePopup.description}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-2xl font-black text-primary font-mono">₹{activeMobilePopup.price}</div>
              </div>

              <button
                onClick={() => {
                  const titleStr = typeof activeMobilePopup.title === 'object' ? (activeMobilePopup.title[language] || activeMobilePopup.title.en) : activeMobilePopup.title;
                  addToCart({ id: activeMobilePopup.id, title: titleStr, price: activeMobilePopup.price, imageUrl: activeMobilePopup.image_url });
                  setActiveMobilePopup(null);
                  router.push("/cart");
                }}
                className="w-full bg-primary text-black font-black text-sm py-4 rounded-2xl uppercase tracking-widest cursor-pointer shadow-xl text-center"
              >
                {t("buy_now")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
