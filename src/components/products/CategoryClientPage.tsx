"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { ProductCard } from "@/components/products/ProductCards";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getLangString } from "@/utils/lang";
import { Filter, X } from "lucide-react";

interface CategoryClientPageProps {
  category: any;
  products: any[];
  id: string;
}

export default function CategoryClientPage({ category, products, id }: CategoryClientPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.history.scrollRestoration = 'manual';
      } catch (e) {}
      
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

      const interval = setInterval(resetScroll, 100);

      const timer = setTimeout(() => {
        clearInterval(interval);
      }, 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [id]);

  const [priceType, setPriceType] = useState<string>(searchParams.get('priceType') || 'all');
  const [priceRange, setPriceRange] = useState<string>(searchParams.get('priceRange') || 'all');
  const [ratingFilter, setRatingFilter] = useState<number>(Number(searchParams.get('rating')) || 0);
  const [langFilter, setLangFilter] = useState<string>(searchParams.get('lang') || 'all');
  const [bundleFilter, setBundleFilter] = useState<string>(searchParams.get('bundle') || 'all');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const updateURLParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (priceType === 'free' && product.price > 0) return false;
        if (priceType === 'paid' && product.price === 0) return false;

        if (priceRange !== 'all') {
          const p = product.price;
          if (priceRange === '0-99' && (p < 0 || p > 99)) return false;
          if (priceRange === '100-299' && (p < 100 || p > 299)) return false;
          if (priceRange === '300-499' && (p < 300 || p > 499)) return false;
          if (priceRange === '500+' && p < 500) return false;
        }

        if (ratingFilter > 0) {
          const rating = 4.5; 
          if (rating < ratingFilter) return false;
        }

        if (langFilter !== 'all') {
          const titleStr = typeof product.title === 'object' ? JSON.stringify(product.title).toLowerCase() : String(product.title).toLowerCase();
          const descStr = typeof product.description === 'object' ? JSON.stringify(product.description).toLowerCase() : String(product.description).toLowerCase();
          const isHindi = titleStr.includes('hindi') || descStr.includes('hindi') || titleStr.includes('हिंदी') || descStr.includes('हिंदी');
          if (langFilter === 'hindi' && !isHindi) return false;
          if (langFilter === 'en' && isHindi) return false;
        }

        if (bundleFilter !== 'all') {
          const isBundle = typeof product.title === 'object' && product.title?.is_bundle;
          if (bundleFilter === 'bundle' && !isBundle) return false;
          if (bundleFilter === 'single' && isBundle) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        const titleA = typeof a.title === 'object' ? (a.title[language] || a.title.en || "") : String(a.title);
        const titleB = typeof b.title === 'object' ? (b.title[language] || b.title.en || "") : String(b.title);
        if (sortBy === 'alpha') return titleA.localeCompare(titleB);
        return new Date(b.created_at || Date.now()).getTime() - new Date(a.created_at || Date.now()).getTime();
      });
  }, [products, priceType, priceRange, ratingFilter, langFilter, bundleFilter, sortBy, language]);

  const displayedProducts = filteredAndSortedProducts.slice(0, visibleCount);

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 pt-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">
        <span>Home</span>
        <span>&gt;</span>
        <span>Categories</span>
        <span>&gt;</span>
        <span className="text-primary">{getLangString(category.title, language)} PPTs</span>
      </div>

      <header className="mb-12 bg-white dark:bg-[#09090B] p-8 md:p-12 rounded-[2.5rem] shadow-sm dark:shadow-2xl border border-zinc-200 dark:border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] overflow-hidden shrink-0 border border-zinc-200 dark:border-white/10 shadow-2xl">
            <img 
              src={category.imageUrl || "https://placehold.co/400x400?text=Category"} 
              alt={getLangString(category.title, language)} 
              loading="lazy"
              className="w-full h-full object-cover transition-all duration-700" 
            />
          </div>
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4 border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Premium Collection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-zinc-900 dark:text-white mb-3 tracking-tighter italic uppercase break-words leading-none">
              {getLangString(category.title, language)} <span className="text-primary">PPTs</span>
            </h1>
            <p className="text-zinc-500 max-w-2xl text-[10px] sm:text-xs font-medium leading-relaxed uppercase tracking-widest italic">
              {getLangString(category.description, language)}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-10 pb-20">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-6 h-fit sticky top-24 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-100 dark:border-white/5 pb-4">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" /> Filters
            </h3>
            <button 
              onClick={() => {
                setPriceType('all'); updateURLParams('priceType', 'all');
                setPriceRange('all'); updateURLParams('priceRange', 'all');
                setRatingFilter(0); updateURLParams('rating', '0');
                setLangFilter('all'); updateURLParams('lang', 'all');
                setBundleFilter('all'); updateURLParams('bundle', 'all');
              }}
              className="text-[10px] font-bold text-zinc-400 hover:text-primary uppercase cursor-pointer bg-transparent border-0"
            >
              Clear All
            </button>
          </div>

          {/* Filters Mapping */}
          <div className="mb-6">
            <h4 className="text-[11px] font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3">Price Type</h4>
            <div className="flex flex-col gap-2">
              {['all', 'free', 'paid'].map(t => (
                <label key={t} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer">
                  <input type="radio" name="priceType" checked={priceType === t} onChange={() => { setPriceType(t); updateURLParams('priceType', t); }} className="accent-primary" />
                  <span className="capitalize">{t === 'all' ? 'All Prices' : t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-[11px] font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3">Price Range</h4>
            <div className="flex flex-col gap-2">
              {['all', '0-99', '100-299', '300-499', '500+'].map(r => (
                <label key={r} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer">
                  <input type="radio" name="priceRange" checked={priceRange === r} onChange={() => { setPriceRange(r); updateURLParams('priceRange', r); }} className="accent-primary" />
                  <span>{r === 'all' ? 'Any' : r.startsWith('500') ? '₹500+' : `₹${r}`}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-[11px] font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3">Language</h4>
            <div className="flex flex-col gap-2">
              {['all', 'en', 'hindi'].map(l => (
                <label key={l} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer">
                  <input type="radio" name="lang" checked={langFilter === l} onChange={() => { setLangFilter(l); updateURLParams('lang', l); }} className="accent-primary" />
                  <span className="capitalize">{l === 'all' ? 'Any' : l === 'en' ? 'English' : 'Hindi'}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-[11px] font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-3">Ratings</h4>
            <div className="flex flex-col gap-2">
              {[0, 4, 3].map(r => (
                <label key={r} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium cursor-pointer">
                  <input type="radio" name="rating" checked={ratingFilter === r} onChange={() => { setRatingFilter(r); updateURLParams('rating', r.toString()); }} className="accent-primary" />
                  <span>{r === 0 ? 'Any Rating' : `${r}★ & Above`}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Space */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl shadow-sm">
            <div className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
              {filteredAndSortedProducts.length} {getLangString(category.title, language)} PPTs Found
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center justify-center gap-2 flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-xs font-bold text-zinc-800 dark:text-white lg:hidden"
              >
                <Filter className="w-4 h-4 text-primary" /> Filters
              </button>

              <select 
                value={sortBy} 
                onChange={(e) => { setSortBy(e.target.value); updateURLParams('sort', e.target.value); }}
                className="flex-1 sm:flex-initial px-3 py-2.5 bg-zinc-100 dark:bg-[#0B0B0D] border border-zinc-200 dark:border-white/10 rounded-xl text-xs font-black text-zinc-800 dark:text-white uppercase"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="alpha">Alphabetical A–Z</option>
              </select>
            </div>
          </div>

          {/* Active Chips */}
          {(priceType !== 'all' || priceRange !== 'all' || ratingFilter > 0 || langFilter !== 'all' || bundleFilter !== 'all') && (
            <div className="flex flex-wrap gap-2 mb-6">
              {priceType !== 'all' && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase">
                  <span>Type: {priceType}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => { setPriceType('all'); updateURLParams('priceType', 'all'); }} />
                </div>
              )}
              {priceRange !== 'all' && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase">
                  <span>Price: {priceRange}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => { setPriceRange('all'); updateURLParams('priceRange', 'all'); }} />
                </div>
              )}
              {langFilter !== 'all' && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold text-primary uppercase">
                  <span>Lang: {langFilter}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => { setLangFilter('all'); updateURLParams('lang', 'all'); }} />
                </div>
              )}
            </div>
          )}

          {/* Grid Render */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product: any) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-white/5 rounded-[2rem] p-16 text-center shadow-sm">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest block mb-2">
                Vault Entry Empty
              </span>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                Clear filters or expand parameters.
              </p>
            </div>
          )}

          {/* Lazy Load Button */}
          {filteredAndSortedProducts.length > visibleCount && (
            <div className="text-center mt-12">
              <button 
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="px-8 py-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-xs font-black text-zinc-800 dark:text-white uppercase tracking-wider hover:text-primary transition-all cursor-pointer"
              >
                Load More Presentations
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isFilterDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden" onClick={() => setIsFilterDrawerOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#09090B] border-t border-zinc-200 dark:border-white/10 rounded-t-[2.5rem] p-6 z-[101] lg:hidden max-h-[80vh] overflow-y-auto">
            <div className="w-12 h-1 bg-zinc-200 dark:bg-white/10 rounded-full mx-auto mb-6" onClick={() => setIsFilterDrawerOpen(false)} />
            <button onClick={() => setIsFilterDrawerOpen(false)} className="w-full bg-primary text-black font-black text-xs py-3.5 rounded-xl uppercase tracking-wider cursor-pointer">
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
