"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
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

export function ProductCard({ id, title, description, price, features, imageUrl, images }: ProductProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const { language } = useLanguage();
  
  const displayImage = imageUrl || (images && images.length > 0 ? images[0] : "");
  const safeFeatures = Array.isArray(features) ? features : [];
  
  const displayTitle = typeof title === 'object' && title !== null ? ((title as any)[language] || (title as any).en || "") : (title || "");
  const displayDescription = typeof description === 'object' && description !== null ? ((description as any)[language] || (description as any).en || "") : (description || "");

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
      className="group bg-[#09090B] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-primary/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(197,165,114,0.05)] relative"
    >
      <Link href={`/product/${id}`} className="block h-48 bg-black relative shrink-0 overflow-hidden cursor-pointer">
        <img 
          src={displayImage || "/placeholder-product.png"} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90 group-hover:opacity-100" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-40" />
      </Link>

      <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
        <div className="mb-4">
          <Link href={`/product/${id}`}>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-primary transition-colors cursor-pointer">{displayTitle}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">Product Entity</p>
          </div>
        </div>
        
        <p className="text-zinc-400 text-xs mb-6 line-clamp-2 leading-relaxed font-normal">{displayDescription}</p>
        
        <div className="space-y-3 mb-8 flex-1">
          {safeFeatures.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center text-[10px] font-semibold text-zinc-500 gap-2 uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-primary/40" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] transition-all border border-white/5"
          >
            Archive
          </button>
          <button 
            onClick={handleShopNow}
            className="flex-1 bg-primary hover:bg-primary-hover text-black px-4 py-3 rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] transition-all shadow-lg"
          >
            Acquire
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroProductCard({ id, title, description, price, features, imageUrl }: ProductProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const { language } = useLanguage();

  const safeFeatures = Array.isArray(features) ? features : [];
  
  const displayTitle = typeof title === 'object' && title !== null ? ((title as any)[language] || (title as any).en || "") : (title || "");
  const displayDescription = typeof description === 'object' && description !== null ? ((description as any)[language] || (description as any).en || "") : (description || "");

  const handleAddToCart = () => {
    addToCart({ id, title: displayTitle, price, imageUrl: imageUrl });
  };

  const handleShopNow = () => {
    addToCart({ id, title: displayTitle, price, imageUrl: imageUrl });
    router.push("/cart");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-[#09090B] border border-white/5 rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row min-h-[500px] hover:border-primary/20 transition-all duration-700 hover:shadow-[0_0_80px_rgba(197,165,114,0.05)] relative"
    >
      <div className="flex-1 p-8 md:p-10 lg:p-16 flex flex-col justify-center relative z-10 order-2 lg:order-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-[1px] bg-primary/40" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Elite Category Segment</span>
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

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 md:gap-6">
          <button 
            onClick={handleShopNow}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-black px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 uppercase tracking-widest italic text-center"
          >
            Acquire Now — ₹{price}
          </button>
          <button 
            onClick={handleAddToCart}
            className="w-full sm:w-auto px-8 py-4 md:py-5 rounded-2xl font-black text-[10px] text-white border border-white/10 hover:bg-white/5 transition-all uppercase tracking-[0.2em] text-center"
          >
            Stage to Vault
          </button>
        </div>
      </div>

      <Link href={`/product/${id}`} className="w-full lg:w-1/2 relative min-h-[300px] md:min-h-[400px] lg:min-h-full overflow-hidden cursor-pointer order-1 lg:order-2">
        <img 
          src={imageUrl || "/placeholder-product.png"} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] opacity-80 group-hover:opacity-100" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/800x400?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#09090B]/60" />
      </Link>
    </motion.div>
  );
}
