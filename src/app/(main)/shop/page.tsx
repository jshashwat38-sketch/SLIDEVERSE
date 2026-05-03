"use client";

import { useState, useEffect } from "react";
import { getProducts } from "@/actions/productActions";
import { getReviews } from "@/actions/adminActions";
import { ProductCard } from "@/components/products/ProductCards";
import { useLanguage } from "@/context/LanguageContext";
import { getLangString } from "@/utils/lang";
import { Filter, Search, Check, Star, Zap, ShoppingBag, Grid, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopPage() {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "free" | "paid">("all");
  const [priceSort, setPriceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");
  const [ratingSort, setRatingSort] = useState<"none" | "highest">("none");
  const [langFilter, setLangFilter] = useState<"all" | "hindi" | "english">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Bottom sheet mobile

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prodData, revData] = await Promise.all([
        getProducts(),
        getReviews()
      ]);
      setProducts(prodData || []);
      setReviews(revData || []);
      setFilteredProducts(prodData || []);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    let result = [...products];

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const titleStr = typeof p.title === "object" ? JSON.stringify(p.title) : String(p.title);
        const descStr = typeof p.description === "object" ? JSON.stringify(p.description) : String(p.description);
        const catStr = String(p.category_id || "").toLowerCase();
        const keywordStr = Array.isArray(p.features) ? p.features.join(" ") : "";
        return titleStr.toLowerCase().includes(q) || descStr.toLowerCase().includes(q) || catStr.includes(q) || keywordStr.toLowerCase().includes(q);
      });
    }

    // 2. Pricing Filter
    if (filterType === "free") {
      result = result.filter(p => Number(p.price) === 0);
    } else if (filterType === "paid") {
      result = result.filter(p => Number(p.price) > 0);
    }

    // 3. Language Filter
    if (langFilter === "hindi") {
      result = result.filter(p => {
        const titleStr = typeof p.title === "object" ? JSON.stringify(p.title) : String(p.title);
        const descStr = typeof p.description === "object" ? JSON.stringify(p.description) : String(p.description);
        return titleStr.toLowerCase().includes("hindi") || descStr.toLowerCase().includes("hindi");
      });
    } else if (langFilter === "english") {
      result = result.filter(p => {
        const titleStr = typeof p.title === "object" ? JSON.stringify(p.title) : String(p.title);
        const descStr = typeof p.description === "object" ? JSON.stringify(p.description) : String(p.description);
        return !titleStr.toLowerCase().includes("hindi") && !descStr.toLowerCase().includes("hindi");
      });
    }

    // 4. Category Filter
    if (categoryFilter !== "all") {
      result = result.filter(p => String(p.category_id || "").toLowerCase() === categoryFilter.toLowerCase());
    }

    // Pre-calculate ratings
    const ratingsMap: Record<string, { sum: number; count: number }> = {};
    reviews.forEach((rev: any) => {
      const pId = typeof rev.role === "object" ? rev.role?.en || rev.role?.product_id : String(rev.role);
      if (pId && rev.code === "VERIFIED_BUYER") {
        if (!ratingsMap[pId]) ratingsMap[pId] = { sum: 0, count: 0 };
        ratingsMap[pId].sum += Number(rev.rating || 5);
        ratingsMap[pId].count += 1;
      }
    });

    // 5. Price Sorting
    if (priceSort === "low-to-high") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (priceSort === "high-to-low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // 6. Rating Sorting
    if (ratingSort === "highest") {
      result.sort((a, b) => {
        const rateA = ratingsMap[a.id] ? (ratingsMap[a.id].sum / ratingsMap[a.id].count) : 0;
        const rateB = ratingsMap[b.id] ? (ratingsMap[b.id].sum / ratingsMap[b.id].count) : 0;
        return rateB - rateA;
      });
    }

    setFilteredProducts(result);
  }, [searchQuery, filterType, langFilter, categoryFilter, priceSort, ratingSort, products, reviews]);

  const uniqueCategories = Array.from(new Set(products.map(p => String(p.category_id || "General").trim()))).filter(Boolean);

  const getPriceLabel = (type: string) => {
    if (type === "all") return t("all_formats");
    if (type === "free") return t("free_ppts");
    return t("paid_ppts");
  };

  const getLangLabel = (type: string) => {
    if (type === "all") return t("all_languages");
    if (type === "hindi") return t("hindi_only");
    return t("english_only");
  };

  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-[#09090B] text-white pb-20 pt-10">
      {/* Search Header */}
      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic flex items-center gap-2 mb-2">
              <Zap className="w-3 h-3 text-primary" /> {t("full_collection")}
            </span>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">{t("home")} <span className="text-primary neon-text">{t("full_collection")}</span></h1>
          </div>
          
          {/* Top Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/5 rounded-[1.5rem] text-sm text-white placeholder:text-zinc-600 uppercase font-bold tracking-wider"
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 bg-[#09090B] border border-white/5 rounded-[2.5rem] p-8 space-y-8 sticky top-28 h-fit shadow-xl border-t border-t-primary/10">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-black text-white uppercase tracking-widest italic">{t("browsing_parameters")}</span>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("pricing_structure")}</label>
            <div className="flex flex-col gap-2">
              {["all", "free", "paid"].map((tType) => (
                <button 
                  key={tType}
                  onClick={() => setFilterType(tType as any)}
                  className={`px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between ${filterType === tType ? 'bg-primary text-black border-transparent' : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'}`}
                >
                  <span>{getPriceLabel(tType)}</span>
                  {filterType === tType && <Check className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("product_segments")}</label>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              <button 
                onClick={() => setCategoryFilter("all")}
                className={`px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between ${categoryFilter === "all" ? 'bg-primary text-black border-transparent' : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'}`}
              >
                <span>{t("all_categories")}</span>
                {categoryFilter === "all" && <Check className="w-4 h-4 text-black" />}
              </button>
              {uniqueCategories.map((cat) => {
                let rawStr = String(cat || "").replace(/^\[HI\]\s*/i, "").replace(/^\[EN\]\s*/i, "").trim();
                let key = rawStr.toLowerCase().replace(/\s+/g, '_');
                let catLabel = t(key);
                if (catLabel === key || !catLabel) {
                  catLabel = rawStr;
                }
                return (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between ${categoryFilter === cat ? 'bg-primary text-black border-transparent' : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'}`}
                  >
                    <span>{catLabel}</span>
                    {categoryFilter === cat && <Check className="w-4 h-4 text-black" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-4">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("linguistic_options")}</label>
            <div className="flex flex-col gap-2">
              {["all", "hindi", "english"].map((l) => (
                <button 
                  key={l}
                  onClick={() => setLangFilter(l as any)}
                  className={`px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between ${langFilter === l ? 'bg-primary text-black border-transparent' : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'}`}
                >
                  <span>{getLangLabel(l)}</span>
                  {langFilter === l && <Check className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-4">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("valuation_sorting")}</label>
            <div className="flex flex-col gap-2">
              {[
                { value: "none", label: t("no_sorting") },
                { value: "low-to-high", label: t("low_to_high") },
                { value: "high-to-low", label: t("high_to_low") }
              ].map((s) => (
                <button 
                  key={s.value}
                  onClick={() => setPriceSort(s.value as any)}
                  className={`px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between ${priceSort === s.value ? 'bg-primary text-black border-transparent' : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'}`}
                >
                  <span>{s.label}</span>
                  {priceSort === s.value && <Check className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("consumer_feedback")}</label>
            <button 
              onClick={() => setRatingSort(ratingSort === "highest" ? "none" : "highest")}
              className={`px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between w-full ${ratingSort === "highest" ? 'bg-primary text-black border-transparent' : 'bg-white/[0.02] text-zinc-400 hover:text-white border border-white/5'}`}
            >
              <span>{t("highest_rated")}</span>
              {ratingSort === "highest" && <Check className="w-4 h-4 text-black" />}
            </button>
          </div>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="lg:hidden col-span-1 flex justify-end">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-wider shadow-lg hover:border-primary/20 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>{t("browsing_parameters")}</span>
          </button>
        </div>

        {/* Product Grid */}
        <div className="col-span-1 lg:col-span-3">
          {loading ? (
            <div className="text-center py-40 text-zinc-600 font-black uppercase tracking-widest text-xs">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-32 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
              <ShoppingBag className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500 uppercase tracking-widest font-black text-xs">{t("empty_states")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-7 lg:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-in fade-in duration-500 h-full">
                  <div className="block sm:hidden h-full">
                    <ProductCard {...product} variant="compact-home-mobile" />
                  </div>
                  <div className="hidden sm:block h-full">
                    <ProductCard {...product} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-[#09090B] border-t border-white/10 rounded-t-[3rem] p-8 z-50 lg:hidden max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-8" onClick={() => setIsFilterOpen(false)} />
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-black text-white italic uppercase tracking-wider">{t("browsing_parameters")}</span>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="text-primary text-[10px] font-black uppercase tracking-widest"
                >
                  {t("done_filtering")}
                </button>
              </div>

              <div className="space-y-8 pb-10">
                <div className="space-y-4">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("pricing_structure")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["all", "free", "paid"].map((tType) => (
                      <button 
                        key={tType}
                        onClick={() => setFilterType(tType as any)}
                        className={`px-3 py-4 rounded-xl text-center text-[9px] font-black uppercase tracking-wider transition-all ${filterType === tType ? 'bg-primary text-black' : 'bg-white/[0.02] text-zinc-400 border border-white/5'}`}
                      >
                        {getPriceLabel(tType)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("linguistic_options")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["all", "hindi", "english"].map((l) => (
                      <button 
                        key={l}
                        onClick={() => setLangFilter(l as any)}
                        className={`px-3 py-4 rounded-xl text-center text-[9px] font-black uppercase tracking-wider transition-all ${langFilter === l ? 'bg-primary text-black' : 'bg-white/[0.02] text-zinc-400 border border-white/5'}`}
                      >
                        {getLangLabel(l)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("product_segments")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setCategoryFilter("all")}
                      className={`px-4 py-3 rounded-xl text-center text-[9px] font-black uppercase tracking-wider transition-all ${categoryFilter === "all" ? 'bg-primary text-black' : 'bg-white/[0.02] text-zinc-400 border border-white/5'}`}
                    >
                      {t("all_categories")}
                    </button>
                    {uniqueCategories.map((cat) => {
                      let rawStr = String(cat || "").replace(/^\[HI\]\s*/i, "").replace(/^\[EN\]\s*/i, "").trim();
                      let key = rawStr.toLowerCase().replace(/\s+/g, '_');
                      let catLabel = t(key);
                      if (catLabel === key || !catLabel) {
                        catLabel = rawStr;
                      }
                      return (
                        <button 
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-4 py-3 rounded-xl text-center text-[9px] font-black uppercase tracking-wider transition-all ${categoryFilter === cat ? 'bg-primary text-black' : 'bg-white/[0.02] text-zinc-400 border border-white/5'}`}
                        >
                          {catLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("valuation_sorting")}</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: "none", label: t("no_sorting") },
                      { value: "low-to-high", label: t("low_to_high") },
                      { value: "high-to-low", label: t("high_to_low") }
                    ].map((s) => (
                      <button 
                        key={s.value}
                        onClick={() => setPriceSort(s.value as any)}
                        className={`px-4 py-3 rounded-xl text-center text-[9px] font-black uppercase tracking-wider transition-all ${priceSort === s.value ? 'bg-primary text-black' : 'bg-white/[0.02] text-zinc-400 border border-white/5'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">{t("consumer_feedback")}</label>
                  <button 
                    onClick={() => setRatingSort(ratingSort === "highest" ? "none" : "highest")}
                    className={`px-4 py-4 rounded-xl text-center text-[9px] font-black uppercase tracking-wider transition-all w-full ${ratingSort === "highest" ? 'bg-primary text-black' : 'bg-white/[0.02] text-zinc-400 border border-white/5'}`}
                  >
                    {t("highest_rated")}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
