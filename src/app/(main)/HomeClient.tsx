"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Sparkles, Mail, Phone, Send, LogOut, Filter, Check, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { saveGrievance } from "@/actions/adminActions";
import { toast } from "react-hot-toast";
import { ProductCard, HeroProductCard } from "@/components/products/ProductCards";
import { useLanguage } from "@/context/LanguageContext";
import { getLangString } from "@/utils/lang";
import CustomPptBox from "@/components/common/CustomPptBox";

interface HomeClientProps {
  initialAppearance: any;
  initialProducts: any[];
  initialReviews: any[];
}

const PILLAR_COUNT = 3;

export default function HomeClient({ initialAppearance, initialProducts, initialReviews }: HomeClientProps) {
  const { t, language } = useLanguage();
  const [appearance] = useState(initialAppearance);
  const [reviews] = useState(initialReviews);

  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [filterType, setFilterType] = useState<"all" | "free" | "paid">("all");
  const [priceSort, setPriceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");
  const [ratingSort, setRatingSort] = useState<"none" | "highest" | "lowest">("none");
  const [langFilter, setLangFilter] = useState<"all" | "hindi" | "english">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const explicitFeatured = filteredProducts.filter(p => p.is_top9 || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_top9));
  const featuredProducts = explicitFeatured.length > 0 
    ? explicitFeatured.slice(0, 12) 
    : filteredProducts.filter(p => !(p.is_bestseller || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_bestseller))).slice(0, 12);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoRotation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % Math.max(1, featuredProducts.length));
    }, 5000);
  };

  useEffect(() => {
    if (featuredProducts.length > 0) {
      startAutoRotation();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [featuredProducts.length]);

  const handleGridItemClick = (index: number) => {
    setActiveHeroIndex(index);
    startAutoRotation();
  };

  useEffect(() => {
    let result = [...initialProducts];

    // 1. Pricing Filter
    if (filterType === "free") {
      result = result.filter(p => Number(p.price) === 0);
    } else if (filterType === "paid") {
      result = result.filter(p => Number(p.price) > 0);
    }

    // 2. Language Filter
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

    // Pre-process ratings
    const ratingsMap: Record<string, { sum: number; count: number }> = {};
    (reviews || []).forEach((rev: any) => {
      const pId = typeof rev.role === "object" ? rev.role?.en || rev.role?.product_id : String(rev.role);
      if (pId && rev.code === "VERIFIED_BUYER") {
        if (!ratingsMap[pId]) ratingsMap[pId] = { sum: 0, count: 0 };
        ratingsMap[pId].sum += Number(rev.rating || 5);
        ratingsMap[pId].count += 1;
      }
    });

    // 3. Price Sorting
    if (priceSort === "low-to-high") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (priceSort === "high-to-low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    // 4. Rating Sorting
    if (ratingSort === "highest") {
      result.sort((a, b) => {
        const rateA = ratingsMap[a.id] ? (ratingsMap[a.id].sum / ratingsMap[a.id].count) : 0;
        const rateB = ratingsMap[b.id] ? (ratingsMap[b.id].sum / ratingsMap[b.id].count) : 0;
        return rateB - rateA;
      });
    } else if (ratingSort === "lowest") {
      result.sort((a, b) => {
        const rateA = ratingsMap[a.id] ? (ratingsMap[a.id].sum / ratingsMap[a.id].count) : 0;
        const rateB = ratingsMap[b.id] ? (ratingsMap[b.id].sum / ratingsMap[b.id].count) : 0;
        return rateA - rateB;
      });
    }

    setFilteredProducts(result);
  }, [filterType, priceSort, ratingSort, langFilter, initialProducts, reviews]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const [activePillar, setActivePillar] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);

  const productRef = useRef<HTMLDivElement>(null);
  const pillarRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  // Robust Auto-scroll logic with Ref-based Index tracking
  const pillarIndex = useRef(0);
  const reviewIndex = useRef(0);
  const productIndex = useRef(0);

  const handleScroll = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    if (target.startsWith('/#')) {
      const id = target.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        if (id === "story") {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    } else {
      window.location.href = target;
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          if (id === "story") {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 600);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      // Products
      if (productRef.current) {
        productIndex.current = (productIndex.current + 1) % Math.max(1, initialProducts.length - 1);
        const cardWidth = productRef.current.offsetWidth * 0.85 + 24;
        productRef.current.scrollTo({ left: productIndex.current * cardWidth, behavior: 'smooth' });
      }
      // Pillars
      if (pillarRef.current) {
        pillarIndex.current = (pillarIndex.current + 1) % PILLAR_COUNT;
        const cardWidth = pillarRef.current.offsetWidth * 0.80 + 24;
        pillarRef.current.scrollTo({ left: pillarIndex.current * cardWidth, behavior: 'smooth' });
      }
      // Reviews
      if (reviewRef.current) {
        reviewIndex.current = (reviewIndex.current + 1) % (reviews.length || 1);
        const cardWidth = reviewRef.current.offsetWidth * 0.85 + 24;
        reviewRef.current.scrollTo({ left: reviewIndex.current * cardWidth, behavior: 'smooth' });
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [reviews.length, initialProducts.length]);

  return (
    <div className="overflow-hidden bg-background selection:bg-primary selection:text-black font-sans">
      {/* Subtle Dynamic Scanline */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Hero Section - Refined */}
      <section className="relative pt-12 pb-16 flex items-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          
          {/* Subtle Mesh Glows */}
          <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl text-primary font-bold px-5 py-2.5 rounded-xl mb-8 text-[9px] uppercase tracking-[0.4em] border border-white/5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {t("hero_badge")}
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 leading-[1.1] tracking-tight italic uppercase"
              dangerouslySetInnerHTML={{ 
                __html: t("hero_title")
                  .replace(/Presentation Design/gi, '<span class="text-primary neon-text">Presentation Design</span>')
              }}
            />
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg md:text-xl text-zinc-400 mb-12 max-w-lg leading-relaxed font-medium tracking-normal"
            >
              {t("hero_subtitle")}
            </motion.p>
            
            <motion.div variants={itemVariants} className="hidden md:flex flex-col sm:flex-row items-center gap-6">
              <Link href="/shop" className="group relative w-full sm:w-auto">
                <button className="relative w-full sm:w-auto bg-primary hover:bg-white text-black px-10 py-5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 uppercase tracking-wider italic">
                  {t("explore_collection")} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link href={appearance?.buttons?.secondary?.link || "/signin"} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-xl font-bold text-base transition-all border border-white/5 uppercase tracking-wider italic text-center">
                {t("sign_in_securely")}
              </Link>
            </motion.div>

            {/* Mobile Decorative Glows - Cleaned Up */}
            <div className="md:hidden absolute top-20 right-0 -z-10 pointer-events-none opacity-20">
              <div className="w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
            </div>

            {/* Mobile Command Hub - Refined Horizontal Scroll */}
            <motion.div 
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-10 md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">{t("active_sectors")}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest italic opacity-80">{t("online_status")}</span>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
                {[
                  { name: t("about"), icon: Shield, link: "/#about", code: "01" },
                  { name: t("contact"), icon: Send, link: "/#contact", code: "02" },
                  { name: t("vault"), icon: Sparkles, link: "/account", code: "03" }
                ].map((btn, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <a 
                      href={btn.link} 
                      onClick={(e) => handleScroll(e, btn.link)}
                      className="shrink-0 w-28 aspect-square flex flex-col items-center justify-center bg-white/[0.03] border border-white/10 rounded-[2rem] group active:scale-95 transition-all relative overflow-hidden cursor-pointer"
                    >
                      <div className="absolute top-3 left-3 text-[7px] font-black text-zinc-800">{btn.code}</div>
                      <btn.icon className="w-6 h-6 text-primary mb-2" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest italic">{btn.name}</span>
                    </a>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/shop" className="mt-2 flex items-center justify-between p-5 bg-primary border border-primary rounded-2xl group active:scale-95 transition-all shadow-[0_15px_40px_rgba(197,165,114,0.25)] overflow-hidden relative">
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] bg-[length:200%_100%] animate-[shimmer_3s_infinite] pointer-events-none" />
                  <span className="text-[10px] font-black text-black uppercase tracking-[0.25em] italic relative z-10 group-hover:translate-x-1 transition-transform">{t("access_full_collection")}</span>
                  <ArrowRight className="w-5 h-5 text-black relative z-10 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Premium Desktop Decorative Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: [0, -15, 0],
            }}
            transition={{ 
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="hidden lg:block relative group z-10"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-[2.5rem] blur-2xl group-hover:bg-primary/20 transition-all duration-700 -z-10" />
            <Image 
              src="/uploads/slideverse_presentation_hero.png"
              alt="Slideverse Premium Presentation Framework"
              width={600}
              height={600}
              className="rounded-[2.5rem] border border-white/10 shadow-2xl object-cover hover:border-primary/40 transition-colors duration-500 shadow-[0_20px_50px_rgba(197,165,114,0.15)]"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Sort & Filter Section */}
      <section id="featured" className="scroll-mt-24 py-20 md:py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center justify-center text-center gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight italic uppercase" dangerouslySetInnerHTML={{ __html: t("ppt_marketplace").replace(/Marketplace/gi, '<span class="text-primary">Marketplace</span>').replace(/मार्केटप्लेस/gi, '<span class="text-primary">मार्केटप्लेस</span>') }} />
            <p className="text-sm text-zinc-500 font-medium tracking-wide mb-8">
              {t("marketplace_subtitle")}
            </p>

            <Link href="/shop">
              <button className="bg-primary hover:bg-primary-hover text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:border-primary/40 transition-all cursor-pointer shadow-[0_15px_30px_rgba(197,165,114,0.3)] mx-auto group">
                <span>{t("view_full_collection")}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
              <p className="text-zinc-500 uppercase tracking-widest font-black text-xs">{t("empty_states")}</p>
            </div>
          ) : (
            <>
              {featuredProducts[activeHeroIndex] && (
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={featuredProducts[activeHeroIndex].id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <HeroProductCard {...featuredProducts[activeHeroIndex]} />
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

                {/* Desktop Grid (Hidden on Mobile) */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                  {featuredProducts.map((product, index) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05, duration: 0.6 }}
                      className={`transition-all duration-500 rounded-[2.5rem] cursor-pointer ${
                        index === activeHeroIndex 
                          ? "ring-2 ring-primary border border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(197,165,114,0.15)] scale-[1.02]" 
                          : "border border-transparent hover:border-white/5"
                      }`}
                      onClick={() => handleGridItemClick(index)}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Grid (Compact 3 Columns) */}
                <div className="grid sm:hidden grid-cols-3 gap-1.5">
                  {featuredProducts.map((product, index) => (
                    <div 
                      key={`mob-${product.id}`}
                      className={`rounded-xl overflow-hidden ${
                        index === activeHeroIndex 
                          ? "ring-1 ring-primary border border-primary/20 scale-[1.02]" 
                          : "border border-transparent"
                      }`}
                      onClick={() => handleGridItemClick(index)}
                    >
                      <ProductCard {...product} variant="compact-home-mobile" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bestsellers Grid */}
              <div className="mt-32 border-t border-zinc-200 dark:border-white/5 pt-28 sm:pt-20">
                <div className="flex flex-col items-center justify-center text-center mb-16 gap-2">
                  <h3 className="text-3xl md:text-5xl font-heading font-bold text-zinc-900 dark:text-white uppercase tracking-tighter italic">
                    Our <span className="text-primary">Bestsellers</span>
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2">
                    Most Loved Templates by Our Customers
                  </p>
                </div>

                {/* Desktop Bestsellers (Hidden on Mobile) */}
                <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
                  {(() => {
                    const explicitBestsellers = filteredProducts.filter(p => p.is_bestseller || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_bestseller));
                    return explicitBestsellers.length > 0 
                      ? explicitBestsellers.slice(0, 25) 
                      : filteredProducts.filter(p => !(p.is_top9 || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_top9))).slice(0, 25);
                  })().map((product, index) => (
                    <motion.div 
                      key={`best-${product.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (index % 5) * 0.05, duration: 0.6 }}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))}
                </div>

                {/* Mobile Bestsellers (Compact 5 Columns) */}
                <div className="grid sm:hidden grid-cols-5 gap-1.5">
                  {(() => {
                    const explicitBestsellers = filteredProducts.filter(p => p.is_bestseller || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_bestseller));
                    return explicitBestsellers.length > 0 
                      ? explicitBestsellers.slice(0, 25) 
                      : filteredProducts.filter(p => !(p.is_top9 || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_top9))).slice(0, 25);
                  })().map((product, index) => (
                    <div key={`best-mob-${product.id}`} className="rounded-xl overflow-hidden">
                      <ProductCard {...product} variant="micro-grid-mobile" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="scroll-mt-24 py-20 md:py-32 relative overflow-hidden bg-card/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative lg:w-[110%] -ml-[5%]"
          >
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
            <div className="relative z-10 p-2 bg-gradient-to-br from-primary/20 to-transparent rounded-[3.2rem]">
              <img 
                src={appearance?.about?.image || "/assets/hero_v2.png"} 
                alt="Elite Workspace" 
                className="rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(197,165,114,0.1)] opacity-90 hover:opacity-100 transition-all duration-700 animate-float" 
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-primary/30" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Established Excellence</span>
            </div>
            <h2 
              className="text-5xl md:text-6xl font-heading font-bold text-white mb-8 tracking-tighter italic uppercase leading-[0.9]"
              dangerouslySetInnerHTML={{ __html: getLangString(appearance?.about?.title, language) || 'The Digital <span class="text-primary">Atelier</span>' }}
            />
            <p className="text-xl text-zinc-400 mb-12 leading-relaxed font-medium italic border-l-2 border-primary/20 pl-8">
              {getLangString(appearance?.about?.description, language) || "We are a specialized laboratory of digital architects, dedicated to engineering the most sophisticated presentation frameworks in the modern era."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
                <div className="text-primary font-black text-3xl mb-2 tracking-tighter italic group-hover:scale-110 transition-transform origin-left">99.9%</div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Precision Engineering</div>
              </div>
              <div className="bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
                <div className="text-primary font-black text-3xl mb-2 tracking-tighter italic group-hover:scale-110 transition-transform origin-left">24/7</div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black leading-none">Tactical Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 md:py-40 bg-card/60 relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(197,165,114,0.05),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center mb-40">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative lg:order-2"
            >
              <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-[4rem] opacity-50" />
              <img 
                src={appearance?.story?.image || "/assets/story_v2.png"} 
                alt="Creative Vision" 
                className="relative z-10 rounded-[3.5rem] border border-white/10 shadow-2xl hover:scale-[1.02] transition-all duration-700 animate-float" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-1 scroll-mt-24"
              id="story"
            >
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">The Genesis Project</span>
              </div>
              <h2 
                className="text-5xl md:text-7xl font-heading font-bold text-white mb-10 tracking-tighter italic uppercase leading-[0.85]"
                dangerouslySetInnerHTML={{ __html: getLangString(appearance?.story?.title, language) || `Beyond the <br /> <span class="text-primary">Standard</span>` }}
              />
              <p className="text-xl text-zinc-500 mb-12 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-8">
                {getLangString(appearance?.story?.subtitle, language) || "Elevating professional narratives into cinematic experiences of architectural clarity."}
              </p>

              <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                <h4 className="text-2xl font-heading font-bold text-white mb-6 uppercase tracking-widest italic flex items-center gap-4">
                  <Zap className="w-6 h-6 text-primary" /> Our Mission
                </h4>
                <p className="text-zinc-500 leading-relaxed text-lg font-medium">Slideverse was founded on a singular principle: that every idea of value deserves a medium of equal quality. We bridge the gap between complex intelligence and visual impact.</p>
              </div>
            </motion.div>
          </div>

          <div 
            className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-4 pb-2 -mx-6 px-6 scrollbar-hide scroll-smooth"
            ref={pillarRef}
          >
            {[
              { title: "Architectural Integrity", desc: "Every slide is built on a foundation of structural perfection. We prioritize spatial balance and visual hierarchy to ensure your content is not just seen, but understood at a fundamental level through rigorous design principles." },
              { title: "Cinematic Motion", desc: "Transitions that bridge the gap between presentation and cinema. Our proprietary motion system engineers fluidity into every slide change, creating a seamless narrative flow that captivates professional audiences with high-end optics." },
              { title: "Tactical Delivery", desc: "Engineered for high-stakes environments where clarity is paramount. Every element is stress-tested for maximum performance across all hardware, ensuring your vision is delivered with absolute precision and zero latency." }
            ].map((pillar, i) => (
              <div 
                key={i}
                className="min-w-[80vw] snap-center p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 relative z-10">Pillar 0{i+1}</div>
                <h4 className="text-white font-bold text-2xl mb-4 italic uppercase tracking-tighter leading-tight relative z-10">{pillar.title}</h4>
                <p className="text-zinc-400 text-[13px] leading-relaxed font-medium relative z-10">{pillar.desc}</p>
              </div>
            ))}
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-3 gap-10">
            {[
              { title: "Architectural Integrity", desc: "Every slide is built on a foundation of structural perfection." },
              { title: "Cinematic Motion", desc: "Transitions that bridge the gap between presentation and cinema." },
              { title: "Tactical Delivery", desc: "Engineered for high-stakes environments where clarity is paramount." }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/30 transition-all text-center group"
              >
                <div className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 group-hover:tracking-[0.6em] transition-all">Pillar 0{i+1}</div>
                <h4 className="text-white font-bold text-2xl mb-6 italic uppercase tracking-tighter">{pillar.title}</h4>
                <p className="text-zinc-500 text-base leading-relaxed font-medium">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter italic uppercase">
              Client <span className="text-primary">Transmissions</span>
            </h2>
            <p className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-[0.4em] font-black">Verified Intelligence from the Field</p>
          </motion.div>

          {/* Snap-Scroll Rotating Reviews - Mobile Optimized with No Clipping and Auto-Motion */}
          <div 
            className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-6 pb-4 -mx-6 px-6 scrollbar-hide scroll-smooth"
            ref={reviewRef}
          >
            {(reviews.length > 0 ? reviews : []).map((testimonial: any, i: number) => (
              <div 
                key={i}
                className="min-w-[85vw] snap-center bg-white/[0.03] backdrop-blur-sm p-12 rounded-[3.5rem] border border-white/5 relative flex flex-col justify-between min-h-[350px] shadow-2xl text-left"
              >
                <div className="absolute top-10 right-10 text-primary/20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em] mb-8 leading-none">Feed // {testimonial.code}</div>
                  <p className="text-zinc-300 text-lg leading-relaxed font-bold italic mb-8">
                    "{getLangString(testimonial.text, language)}"
                  </p>
                </div>
                <div className="border-t border-white/5 pt-8 text-left">
                  <div className="text-white font-bold text-sm uppercase tracking-widest leading-none">
                    {getLangString(testimonial.name, language)}
                  </div>
                  <div className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mt-3 leading-none">
                    {getLangString(testimonial.role, language)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-3 gap-8">
            {(reviews.length > 0 ? reviews : []).map((testimonial: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/5 relative group hover:border-primary/20 transition-all"
              >
                <div className="absolute top-8 right-8 text-primary/20 group-hover:text-primary/40 transition-colors">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="text-zinc-600 text-[8px] font-bold uppercase tracking-[0.4em] mb-6">Encrypted Feed // {testimonial.code}</div>
                <p className="text-zinc-300 text-lg leading-relaxed font-medium italic mb-10">
                  "{getLangString(testimonial.text, language)}"
                </p>
                <div className="border-t border-white/5 pt-8">
                  <div className="text-white font-bold text-sm uppercase tracking-widest">
                    {getLangString(testimonial.name, language)}
                  </div>
                  <div className="text-primary text-[9px] font-bold uppercase tracking-[0.3em] mt-1">
                    {getLangString(testimonial.role, language)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <CustomPptBox />
      </div>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-24 py-24 md:py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 md:gap-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] italic">The Relay Hub</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-10 tracking-tighter italic uppercase leading-[0.9]">Establish <br /> <span className="text-primary">Contact</span></h2>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6 group">
                <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className="w-14 h-14 md:w-16 md:h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </a>
                <div className="flex flex-col justify-center">
                  <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-1 leading-none">Direct Relay</h3>
                  <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className="text-base sm:text-lg md:text-xl text-white font-bold tracking-tight hover:text-primary transition-colors leading-tight break-all">{appearance?.contact?.email || "support@slideverse.pro"}</a>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                <a 
                  href={`tel:${(appearance?.contact?.mobile || "+91 8602328776").replace(/[^0-9+]/g, '')}`} 
                  className="w-14 h-14 md:w-16 md:h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110 active:scale-95 touch-manipulation"
                >
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </a>
                <div className="flex flex-col justify-center">
                  <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-1 leading-none">Secure Line</h3>
                  <a 
                    href={`tel:${(appearance?.contact?.mobile || "+91 8602328776").replace(/[^0-9+]/g, '')}`} 
                    className="text-lg md:text-xl text-white font-bold tracking-tight hover:text-primary transition-colors leading-tight touch-manipulation"
                  >
                    {appearance?.contact?.mobile || "+91 8602328776"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl p-8 md:p-12 lg:p-16 rounded-[3rem] md:rounded-[4rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[120px] -mr-32 -mt-32 pointer-events-none" />
              <form className="space-y-8 md:space-y-10 relative z-10" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get("name") as string,
                  email: formData.get("email") as string,
                  message: formData.get("message") as string
                };
                const res = await saveGrievance(data);
                if (res.success) {
                  toast.success("Broadcast successful. Comms channel open.");
                  (e.target as HTMLFormElement).reset();
                }
              }}>
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] px-1">Identity Protocol</label>
                    <input name="name" type="text" required placeholder="ENTER NAME..." className="w-full bg-background/60 border border-white/10 rounded-xl px-6 py-4 text-foreground text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-background transition-all placeholder:text-zinc-400" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] px-1">Relay Endpoint</label>
                    <input name="email" type="email" required placeholder="ENTER EMAIL..." className="w-full bg-background/60 border border-white/10 rounded-xl px-6 py-4 text-foreground text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-background transition-all placeholder:text-zinc-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] px-1">Intelligence Data</label>
                  <textarea name="message" required rows={5} placeholder="COMPOSE TRANSMISSION..." className="w-full bg-background/60 border border-white/10 rounded-xl px-6 py-4 text-foreground text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-background transition-all placeholder:text-zinc-400 resize-none"></textarea>
                </div>
                <button 
                  type="submit" 
                  className="group relative w-full py-6 md:py-8 bg-primary hover:bg-primary-hover text-white rounded-[1.5rem] transition-all duration-700 shadow-lg hover:scale-[1.02] active:scale-[0.98] border border-white/20 overflow-hidden cursor-pointer"
                >
                  <div className="relative z-10 flex flex-col items-center justify-center text-white w-full px-6">
                    <span className="font-black text-sm sm:text-base md:text-xl uppercase tracking-[0.25em] block leading-tight text-center">
                      <span className="block md:inline">Execute</span>
                      <span className="block md:inline md:ml-3">Broadcast</span>
                    </span>
                  </div>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
