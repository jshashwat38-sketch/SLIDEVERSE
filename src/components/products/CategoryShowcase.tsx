"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CategoryShowcase({ products, categories, language, t, isLoading: propIsLoading }: { products: any[]; categories: any[]; language: string; t: any; isLoading?: boolean }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [hoveredProduct, setHoveredProduct] = useState<any | null>(null);
  const [activeMobilePopup, setActiveMobilePopup] = useState<any | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!propIsLoading) {
      // Small delay for smooth transition once data is ready
      const timer = setTimeout(() => setIsInitialLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [propIsLoading]);

  useEffect(() => {
    if (selectedCategoryId) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setVisibleCount(20);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [selectedCategoryId]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const categorySliderRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  const scrollCategorySlider = (direction: 'left' | 'right') => {
    if (!categorySliderRef.current) return;
    const scrollAmount = 300;
    categorySliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories]);

  const filtered = products.filter(p => p.category_id === selectedCategoryId).slice(0, visibleCount);
  const totalInCategory = products.filter(p => p.category_id === selectedCategoryId).length;
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
    <section className="py-24 border-t border-zinc-200 dark:border-white/5 relative bg-[#FCFBF8] dark:bg-[#040405]">
      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headings */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter">
            Templates to transform your <span className="text-primary neon-text">business and career</span>
          </h2>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em] mt-3">
            Browse premium presentations by category.
          </p>
        </div>

        {isInitialLoading ? (
          <div className="animate-in fade-in duration-700">
            {/* Loading Header */}
            <div className="flex flex-col items-center justify-center mb-16 space-y-4">
              <div className="relative flex items-center justify-center w-20 h-20 mb-4">
                <div className="absolute inset-0 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
                <Package className="w-8 h-8 text-primary/30 animate-pulse" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground italic uppercase tracking-tighter animate-pulse">
                Your Content Is <span className="text-primary">Loading…</span>
              </h3>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] italic">
                Preparing premium templates for you
              </p>
            </div>

            {/* Category Tabs Skeleton */}
            <div className="flex gap-4 justify-center mb-12 overflow-hidden px-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-24 md:w-32 bg-white/5 border border-white/5 rounded-xl animate-pulse shrink-0" />
              ))}
            </div>

            {/* Product Cards Skeleton Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col h-[350px] animate-pulse ${i > 2 ? 'hidden md:flex' : 'flex'} ${i > 3 ? 'hidden lg:flex' : 'flex'}`}>
                  <div className="aspect-square bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="h-4 bg-white/10 rounded-full w-3/4" />
                    <div className="h-3 bg-white/5 rounded-full w-1/2" />
                    <div className="mt-auto h-10 bg-white/10 rounded-xl w-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button Skeleton */}
            <div className="flex justify-center">
              <div className="h-14 w-64 bg-white/5 border border-white/5 rounded-xl animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Clickable Tabs - Horizontal Category Slider */}
            <div className="relative max-w-2xl mx-auto mb-12 group/cat-slider hidden md:block">
              <button
                onClick={() => scrollCategorySlider('left')}
                className="absolute -left-12 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white dark:bg-black/80 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center opacity-0 group-hover/cat-slider:opacity-100 hover:bg-primary hover:text-black hover:border-primary transition-all shadow-md cursor-pointer flex"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCategorySlider('right')}
                className="absolute -right-12 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white dark:bg-black/80 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center opacity-0 group-hover/cat-slider:opacity-100 hover:bg-primary hover:text-black hover:border-primary transition-all shadow-md cursor-pointer flex"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div
                ref={categorySliderRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none select-none px-2 py-1"
              >
                {categories.map((cat) => {
                  const catName = typeof cat.title === 'object' ? (cat.title[language] || cat.title.en) : cat.title;
                  const isActive = cat.id === selectedCategoryId;
                  return (
                    <div
                      key={cat.id}
                      className="snap-start shrink-0 w-[calc(25%-12px)] min-w-[110px]"
                    >
                      <button
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`w-full h-11 px-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer border text-center truncate ${
                          isActive 
                            ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(197,165,114,0.3)]' 
                            : 'bg-zinc-100 dark:bg-[#0B0B0D] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 hover:text-zinc-900 dark:hover:text-white'
                        }`}
                      >
                        {catName}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Premium Category Grid - 3 Options Per Strip */}
            <div className="md:hidden mb-12 px-4">
              <div className="flex flex-col items-center gap-5">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] italic opacity-60">ACTIVE SECTORS</span>
                <div className="grid grid-cols-3 gap-2 w-full max-w-md mx-auto">
                  {categories.map((cat) => {
                    const catName = typeof cat.title === 'object' ? (cat.title[language] || cat.title.en) : cat.title;
                    const isActive = cat.id === selectedCategoryId;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`py-2 px-1 rounded-lg font-black text-[9px] uppercase tracking-wider transition-all duration-300 border text-center truncate ${
                          isActive 
                            ? 'bg-primary text-black border-primary shadow-[0_4px_10px_rgba(197,165,114,0.2)]' 
                            : 'bg-zinc-100 dark:bg-[#0B0B0D] text-zinc-500 dark:text-zinc-500 border-zinc-200 dark:border-white/5'
                        }`}
                      >
                        {catName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

        {/* Horizontal Slider container */}
        <div className="relative group/slider mb-10">
          {/* Slider buttons (Desktop) */}
          <button
            onClick={() => scrollSlider('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-black/80 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl cursor-pointer hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollSlider('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-black/80 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl cursor-pointer hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider Flex */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategoryId}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              ref={sliderRef}
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none select-none pb-12"
            >
              {(isLoading || filtered.length === 0) ? (
                <div className="w-full text-center py-24 bg-white/[0.01] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-6">
                  <div className="relative flex items-center justify-center w-16 h-16">
                    <div className="absolute inset-0 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Package className="w-6 h-6 text-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-zinc-500 font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> 
                      Your content is loading...
                    </span>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest font-black italic">
                      Staging {selectedCatName} assets from the vault
                    </p>
                  </div>
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
                    className="snap-start shrink-0 w-[85%] sm:w-[45%] md:w-[30%] lg:w-[calc(25%-1.5rem)] xl:w-[calc(20%-1.5rem)] relative"
                    onMouseEnter={() => setHoveredProduct(prod)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setActiveMobilePopup(prod);
                      }
                    }}
                  >
                    <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden h-full flex flex-col hover:border-primary/20 transition-all duration-500 shadow-sm">
                      {/* Main Card Link */}
                      <Link 
                        href={typeof prod.title === 'object' && prod.title?.is_bundle ? `/bundle/${prod.title?.slug || prod.id}` : `/product/${prod.id}`} 
                        className="block aspect-square bg-black overflow-hidden relative cursor-pointer"
                      >
                        <img
                          src={prod.image_url || prod.imageUrl || (prod.images && prod.images[0]) || "https://placehold.co/1000x1000?text=No+Asset"}
                          alt={titleStr}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-2xl"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/1000x1000?text=No+Asset";
                          }}
                        />
                        {isBestseller && (
                          <div className="absolute top-3 left-3 bg-primary text-black font-black text-[8px] px-2 py-0.5 rounded uppercase">
                            Bestseller
                          </div>
                        )}
                      </Link>

                      <div className="p-4 flex flex-col flex-1">
                        <Link href={typeof prod.title === 'object' && prod.title?.is_bundle ? `/bundle/${prod.title?.slug || prod.id}` : `/product/${prod.id}`}>
                          <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-tight line-clamp-1 hover:text-primary cursor-pointer">{titleStr}</h3>
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
                          className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 z-50 select-none pointer-events-auto"
                        >
                          <div className="text-xs font-black text-zinc-900 dark:text-white uppercase mb-2 line-clamp-1">{titleStr}</div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-3">{descStr || "Professional slide layouts."}</div>

                          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3 text-primary" /> Multi-layout support
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const isBundle = typeof prod.title === 'object' && prod.title?.is_bundle;
                              if (isBundle) {
                                router.push(`/bundle/${prod.title?.slug || prod.id}`);
                              } else {
                                addToCart({ id: prod.id, title: titleStr, price: prod.price, imageUrl: prod.image_url || prod.imageUrl || (prod.images && prod.images[0]) || "" });
                                router.push("/cart");
                              }
                            }}
                            className="w-full bg-primary hover:bg-primary-hover text-black font-black text-xs py-2.5 rounded-xl uppercase tracking-wider cursor-pointer transition-all shadow-lg text-center"
                          >
                            {typeof prod.title === 'object' && prod.title?.is_bundle ? "Explore Bundle" : t("buy_now")}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </div>

        {/* Dynamic Show All Button */}
        {filtered.length > 0 && (
          <div className="text-center">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/category/${selectedCategoryId?.replace('cat-', '')}`);
                  
                  if (typeof window !== 'undefined') {
                    const resetScroll = () => {
                      window.scrollTo(0, 0);
                      document.documentElement.scrollTop = 0;
                      document.body.scrollTop = 0;
                      
                      const mainEl = document.querySelector('main');
                      if (mainEl) {
                        mainEl.scrollTo(0, 0);
                        mainEl.scrollTop = 0;
                      }
                    };

                    resetScroll();

                    const interval = setInterval(resetScroll, 50);

                    setTimeout(() => clearInterval(interval), 1500);
                  }
                }}
                className="bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white hover:text-primary border border-zinc-200 dark:border-white/10 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto cursor-pointer transition-all"
              >
                <span>Show all {selectedCatName} PPTs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
          </div>
        )}
          </>
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
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0B0B0C] border-t border-zinc-200 dark:border-white/10 rounded-t-[2rem] p-6 z-[101] md:hidden"
            >
              <div className="w-12 h-1.5 bg-zinc-200 dark:bg-white/10 rounded-full mx-auto mb-6" onClick={() => setActiveMobilePopup(null)} />
              
              <div className="text-lg font-black text-zinc-900 dark:text-white uppercase italic mb-2">
                {typeof activeMobilePopup.title === 'object' ? (activeMobilePopup.title[language] || activeMobilePopup.title.en) : activeMobilePopup.title}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                {typeof activeMobilePopup.description === 'object' ? (activeMobilePopup.description[language] || activeMobilePopup.description.en) : activeMobilePopup.description}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-2xl font-black text-primary font-mono">₹{activeMobilePopup.price}</div>
              </div>

               <button
                onClick={() => {
                  const titleStr = typeof activeMobilePopup.title === 'object' ? (activeMobilePopup.title[language] || activeMobilePopup.title.en) : activeMobilePopup.title;
                  const isBundle = typeof activeMobilePopup.title === 'object' && activeMobilePopup.title?.is_bundle;
                  
                  if (isBundle) {
                    setActiveMobilePopup(null);
                    router.push(`/bundle/${activeMobilePopup.title?.slug || activeMobilePopup.id}`);
                  } else {
                    addToCart({ id: activeMobilePopup.id, title: titleStr, price: activeMobilePopup.price, imageUrl: activeMobilePopup.image_url || activeMobilePopup.imageUrl || (activeMobilePopup.images && activeMobilePopup.images[0]) || "" });
                    setActiveMobilePopup(null);
                    router.push("/cart");
                  }
                }}
                className="w-full bg-primary text-black font-black text-sm py-4 rounded-2xl uppercase tracking-widest cursor-pointer shadow-xl text-center"
              >
                {typeof activeMobilePopup.title === 'object' && activeMobilePopup.title?.is_bundle ? "Explore Bundle Entity" : t("buy_now")}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
