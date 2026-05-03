"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ShoppingCart, Star, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getReviews } from "@/actions/adminActions";
import { useLanguage } from "@/context/LanguageContext";

export interface ProductProps {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  imageUrl: string;
  images?: string[];
}

export function ProductCard(props: any) {
  const { id, price, imageUrl, image_url, images, features, variant } = props;
  const { addToCart } = useCart();
  const router = useRouter();
  const { language, t } = useLanguage();
  
  const displayImage = image_url || imageUrl || (images && images.length > 0 ? images[0] : "");
  const safeFeatures = Array.isArray(features) ? features : [];
  
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const allReviews = await getReviews();
      const relevant = allReviews.filter((rev: any) => {
        const pId = typeof rev.role === "object" ? rev.role?.en || rev.role?.product_id : String(rev.role);
        return pId === id && rev.code === "VERIFIED_BUYER";
      });
      if (relevant.length > 0) {
        const sum = relevant.reduce((acc: number, cur: any) => acc + Number(cur.rating || 5), 0);
        setAvgRating(sum / relevant.length);
        setReviewsCount(relevant.length);
      }
    };
    fetchReviews();
  }, [id]);

  let displayTitle = "";
  if (language === 'hi') {
    displayTitle = props.title_hi || (typeof props.title === 'object' && props.title !== null ? props.title.hi : props.title);
  } else {
    displayTitle = props.title_en || (typeof props.title === 'object' && props.title !== null ? props.title.en : props.title);
  }
  if (!displayTitle) {
    displayTitle = props.title_en || props.title_hi || (typeof props.title === 'object' && props.title !== null ? props.title.en || props.title.hi : props.title) || "";
  }

  let displayDescription = "";
  if (language === 'hi') {
    displayDescription = props.desc_hi || (typeof props.description === 'object' && props.description !== null ? props.description.hi : props.description);
  } else {
    displayDescription = props.desc_en || (typeof props.description === 'object' && props.description !== null ? props.description.en : props.description);
  }
  if (!displayDescription) {
    displayDescription = props.desc_en || props.desc_hi || (typeof props.description === 'object' && props.description !== null ? props.description.en || props.description.hi : props.description) || "";
  }

  const mrp = typeof props.title === 'object' && props.title !== null ? Number((props.title as any).mrp || 0) : Number(props.mrp || 0);

  let displayCategory = "Product Entity";
  if (language === 'hi') {
    displayCategory = props.category_hi || props.category_en || "उत्पाद इकाई";
  } else {
    displayCategory = props.category_en || "Product Entity";
  }

  const handleAddToCart = () => {
    addToCart({ id, title: displayTitle, price, imageUrl: displayImage });
  };

  const handleShopNow = () => {
    addToCart({ id, title: displayTitle, price, imageUrl: displayImage });
    router.push("/cart");
  };

  if (variant === "compact-home-mobile") {
    const isBundle = typeof props.title === 'object' && props.title?.is_bundle;
    const bundleHref = `/bundle/${props.title?.slug || id}`;
    const productHref = `/product/${id}`;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group bg-[#09090B] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full hover:border-primary/20 transition-all duration-500 hover:shadow-[0_0_20px_rgba(197,165,114,0.1)] relative"
      >
        <Link href={isBundle ? bundleHref : productHref} className="block aspect-square bg-black relative shrink-0 overflow-hidden cursor-pointer rounded-t-2xl">
          <img 
            src={displayImage || "https://placehold.co/1000x1000?text=No+Asset"} 
            alt={displayTitle} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white dark:from-black via-transparent to-transparent opacity-30" />
        </Link>

        <div className="p-3 sm:p-4 flex flex-col flex-1 relative z-10 bg-white dark:bg-black">
          <div className="mb-2">
            <Link href={isBundle ? `/bundle/${props.title?.slug || id}` : `/product/${id}`}>
              <h3 className="text-xs font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors cursor-pointer line-clamp-2 leading-tight">{displayTitle}</h3>
            </Link>
            <p className="text-[7px] text-zinc-600 font-black uppercase tracking-wider mt-1">{displayCategory}</p>
          </div>
          
          <div className="mt-auto pt-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white font-mono">₹{price}</span>
              {mrp > price && (
                <span className="text-[8px] text-zinc-600 line-through font-bold font-mono">₹{mrp}</span>
              )}
            </div>

            <button 
              onClick={handleShopNow}
              className="w-full bg-primary hover:bg-primary-hover text-black py-2 rounded-lg font-black text-[8px] uppercase tracking-wider transition-all shadow text-center flex items-center justify-center min-h-[28px]"
            >
              {t("buy_now")}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "micro-grid-mobile") {
    return (
      <div className="bg-[#09090B] border border-white/5 rounded-xl overflow-hidden flex flex-col h-full hover:border-primary/20 transition-all relative">
        <Link href={`/product/${id}`} className="block aspect-square bg-black relative shrink-0 overflow-hidden cursor-pointer rounded-t-xl">
          <img 
            src={displayImage || "https://placehold.co/200x150?text=No+Image"} 
            alt={displayTitle} 
            loading="lazy"
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/200x150?text=No+Image";
            }}
          />
        </Link>

        <div className="p-1.5 flex flex-col justify-between flex-1">
          <div>
            <Link href={`/product/${id}`}>
              <h3 className="text-[7.5px] font-black text-white italic uppercase tracking-tighter line-clamp-1 leading-none">{displayTitle}</h3>
            </Link>
            <span className="text-[6px] font-bold text-zinc-500 font-mono mt-1 block">₹{price}</span>
          </div>

          <button 
            onClick={handleShopNow}
            className="w-full bg-primary hover:bg-primary-hover text-black py-1 rounded font-black text-[6px] uppercase tracking-wider transition-all mt-1 flex items-center justify-center min-h-[16px]"
          >
            {t("buy_now")}
          </button>
        </div>
      </div>
    );
  }

  const isBundle = typeof props.title === 'object' && props.title?.is_bundle;
  const bundleItems = typeof props.title === 'object' && Array.isArray(props.title?.bundle_items) ? props.title.bundle_items : [];

  if (isBundle) {
    const slug = props.title?.slug || id;
    const bundleHref = `/bundle/${slug}`;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group bg-[#09090B] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-primary/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(197,165,114,0.05)] relative"
      >
        <Link href={bundleHref} className="block aspect-square bg-black relative shrink-0 overflow-hidden cursor-pointer">
          <img 
            src={displayImage || "https://placehold.co/600x400?text=No+Image"} 
            alt={displayTitle} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-40" />
          <div className="absolute top-4 right-4 bg-primary text-black font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            Bundle
          </div>
        </Link>

        <div className="p-4 sm:p-6 flex flex-col flex-1 relative z-10">
          <div className="mb-4">
            <Link href={bundleHref}>
              <h3 className="text-sm sm:text-lg font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors cursor-pointer line-clamp-1">{displayTitle}</h3>
            </Link>
          </div>

          {/* Included Preview */}
          <div className="mb-4">
            <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block mb-2">Includes:</span>
            <div className="flex flex-wrap gap-2">
              {bundleItems.slice(0, 3).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/[0.03] border border-white/5 rounded-lg px-2 py-1">
                  {item.image && (
                    <img src={item.image} className="w-4 h-4 object-cover rounded" alt="mini-icon" />
                  )}
                  <span className="text-[8px] font-bold text-white line-clamp-1 uppercase tracking-wider">{item.name}</span>
                </div>
              ))}
              {bundleItems.length > 3 && (
                <div className="text-[8px] font-black text-primary px-2 py-1 rounded-lg border border-primary/20 bg-primary/10">
                  +{bundleItems.length - 3} MORE
                </div>
              )}
            </div>
          </div>

          <p className="text-zinc-400 text-[10px] mb-4 line-clamp-2 leading-relaxed font-normal">{displayDescription}</p>

          {/* Pricing */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-zinc-600 line-through font-bold font-mono">₹{mrp || (price * 2)}</span>
              <span className="text-xs text-primary font-black font-mono">₹{price}</span>
              <span className="text-[8px] font-black bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                SAVE 50%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleShopNow}
                className="flex-1 bg-primary hover:bg-primary-hover text-black py-2.5 rounded-xl font-black text-[9px] uppercase tracking-wider transition-all shadow-lg text-center flex items-center justify-center min-h-[36px]"
              >
                {t("buy_now")}
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center min-h-[36px] ${isExpanded ? 'bg-white/10 border-primary text-primary' : 'bg-white/5 border-white/5 text-white hover:border-white/20'}`}
              >
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </div>

          {/* Expand Details Accordion */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-white/5 space-y-3"
              >
                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Bundle Breakdown ({bundleItems.length} Files):</div>
                {bundleItems.map((item: any, i: number) => (
                  <div key={i} className="bg-white/[0.02] p-2 rounded-xl border border-white/5 flex gap-3">
                    {item.image && (
                      <img src={item.image} className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0" alt={item.name} />
                    )}
                    <div>
                      <div className="text-[10px] font-black text-white line-clamp-1 uppercase">{item.name}</div>
                      <div className="text-[8px] text-zinc-400 line-clamp-2 leading-tight mt-0.5">{item.description}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-[#09090B] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-primary/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(197,165,114,0.05)] relative"
    >
      <Link href={`/product/${id}`} className="block aspect-square bg-black relative shrink-0 overflow-hidden cursor-pointer">
        <img 
          src={displayImage || "https://placehold.co/600x400?text=No+Image"} 
          alt={displayTitle} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-40" />
      </Link>

      <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1 relative z-10">
        <div className="mb-4">
          <Link href={`/product/${id}`}>
            <h3 className="text-sm sm:text-lg md:text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors cursor-pointer line-clamp-2">{displayTitle}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-2 w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">{displayCategory}</p>
            {avgRating !== null && (
              <div className="flex items-center gap-1 text-[10px] text-primary ml-auto font-bold">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span>{avgRating.toFixed(1)} ({reviewsCount})</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-zinc-400 text-[10px] sm:text-xs mb-6 line-clamp-4 sm:line-clamp-none leading-relaxed font-normal">{displayDescription}</p>
        
        <div className="space-y-3 mb-8 flex-1">
          {safeFeatures.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center text-[10px] font-semibold text-zinc-500 gap-2 uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-primary/40" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>
        
        {mrp > price && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-zinc-600 line-through font-bold font-mono">₹{mrp}</span>
            <span className="text-xs text-primary font-black font-mono">₹{price}</span>
            <span className="text-[8px] font-black bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {Math.round(((mrp - price) / mrp) * 100)}% OFF
            </span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white px-2 py-2.5 sm:py-3 rounded-xl font-black text-[8px] sm:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all border border-white/5 text-center flex items-center justify-center min-h-[36px]"
          >
            {t("add_to_vault")}
          </button>
          <button 
            onClick={handleShopNow}
            className="flex-1 bg-primary hover:bg-primary-hover text-black px-2 py-2.5 sm:py-3 rounded-xl font-black text-[8px] sm:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all shadow-lg text-center flex items-center justify-center min-h-[36px]"
          >
            {t("buy_now")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroProductCard(props: any) {
  const { id, price, imageUrl, image_url, images, features } = props;
  const { addToCart } = useCart();
  const router = useRouter();
  const { language, t } = useLanguage();

  const displayImage = image_url || imageUrl || (images && images.length > 0 ? images[0] : "");
  const safeFeatures = Array.isArray(features) ? features : [];
  
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const allReviews = await getReviews();
      const relevant = allReviews.filter((rev: any) => {
        const pId = typeof rev.role === "object" ? rev.role?.en || rev.role?.product_id : String(rev.role);
        return pId === id && rev.code === "VERIFIED_BUYER";
      });
      if (relevant.length > 0) {
        const sum = relevant.reduce((acc: number, cur: any) => acc + Number(cur.rating || 5), 0);
        setAvgRating(sum / relevant.length);
        setReviewsCount(relevant.length);
      }
    };
    fetchReviews();
  }, [id]);

  let displayTitle = "";
  if (language === 'hi') {
    displayTitle = props.title_hi || (typeof props.title === 'object' && props.title !== null ? props.title.hi : props.title);
  } else {
    displayTitle = props.title_en || (typeof props.title === 'object' && props.title !== null ? props.title.en : props.title);
  }
  if (!displayTitle) {
    displayTitle = props.title_en || props.title_hi || (typeof props.title === 'object' && props.title !== null ? props.title.en || props.title.hi : props.title) || "";
  }

  let displayDescription = "";
  if (language === 'hi') {
    displayDescription = props.desc_hi || (typeof props.description === 'object' && props.description !== null ? props.description.hi : props.description);
  } else {
    displayDescription = props.desc_en || (typeof props.description === 'object' && props.description !== null ? props.description.en : props.description);
  }
  if (!displayDescription) {
    displayDescription = props.desc_en || props.desc_hi || (typeof props.description === 'object' && props.description !== null ? props.description.en || props.description.hi : props.description) || "";
  }

  const mrp = typeof props.title === 'object' && props.title !== null ? Number((props.title as any).mrp || 0) : Number(props.mrp || 0);

  let displayCategory = "Elite Category Segment";
  if (language === 'hi') {
    displayCategory = props.category_hi || props.category_en || "एलीट श्रेणी खंड";
  } else {
    displayCategory = props.category_en || "Elite Category Segment";
  }

  const handleAddToCart = () => {
    addToCart({ id, title: displayTitle, price, imageUrl: displayImage });
  };

  const handleShopNow = () => {
    addToCart({ id, title: displayTitle, price, imageUrl: displayImage });
    router.push("/cart");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row min-h-[500px] hover:border-primary/20 transition-all duration-700 hover:shadow-[0_0_80px_rgba(197,165,114,0.05)] relative"
    >
      <div className="flex-1 p-8 md:p-10 lg:p-16 flex flex-col justify-center relative z-10 order-2 lg:order-1">
        <div className="flex items-center gap-3 mb-8 w-full">
          <div className="w-10 h-[1px] bg-primary/40" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">{displayCategory}</span>
          {avgRating !== null && (
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold ml-auto bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span>{avgRating.toFixed(1)} ({reviewsCount} reviews)</span>
            </div>
          )}
        </div>
        
        <Link href={`/product/${id}`}>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter mb-6 group-hover:text-primary transition-colors cursor-pointer leading-[0.9]">{displayTitle}</h2>
        </Link>
        <p className="text-zinc-400 text-lg mb-10 max-w-xl font-medium leading-relaxed">{displayDescription}</p>
        
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
          {safeFeatures.slice(0, 4).map((feature, i) => (
            <div key={i} className="flex items-center gap-4 group/item">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/item:bg-primary transition-colors" />
              <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest group-hover/item:text-zinc-300 transition-colors">{feature}</span>
            </div>
          ))}
        </div>

        {mrp > price && (
          <div className="flex items-center gap-3 mb-8">
            <span className="text-lg text-zinc-600 line-through font-black italic font-mono">₹{mrp}</span>
            <span className="text-2xl text-primary font-black italic font-mono">₹{price}</span>
            <span className="text-[10px] font-black bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">
              {Math.round(((mrp - price) / mrp) * 100)}% DISCOUNT
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 md:gap-6">
          <button 
            onClick={handleShopNow}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-black px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 uppercase tracking-widest italic text-center"
          >
            {t("buy_now")} — ₹{price}
          </button>
          <button 
            onClick={handleAddToCart}
            className="w-full sm:w-auto px-8 py-4 md:py-5 rounded-2xl font-black text-[10px] text-white border border-white/10 hover:bg-white/5 transition-all uppercase tracking-[0.2em] text-center"
          >
            {t("add_to_vault")}
          </button>
        </div>
      </div>

      <Link 
        href={`/product/${id}`} 
        className="w-full lg:w-1/2 relative aspect-square lg:aspect-[4/5] overflow-hidden cursor-pointer order-1 lg:order-2 bg-transparent group/img"
      >
        {/* Background Option: Minimal Ambient Glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-1000" />
        </div>

        {/* Main Image Layer: Immersive Floating */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8 md:p-12 lg:p-16">
          <motion.img 
            initial={{ scale: 1 }}
            animate={{ scale: 1.02, y: [0, -10, 0] }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              repeatType: "reverse", 
              ease: "easeInOut" 
            }}
            src={displayImage || "https://placehold.co/1000x1000?text=No+Asset"} 
            alt={displayTitle} 
            className="w-full h-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] select-none" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=No+Image";
            }}
          />
        </div>
        
        {/* Cinematic glow */}
        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      </Link>
    </motion.div>
  );
}
