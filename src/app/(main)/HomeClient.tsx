"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Sparkles, Mail, Phone, Send, LogOut, Filter, Check, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { saveGrievance, getCategories } from "@/actions/adminActions";
import { toast } from "react-hot-toast";
import { ProductCard, HeroProductCard } from "@/components/products/ProductCards";
import { useLanguage } from "@/context/LanguageContext";
import { getLangString } from "@/utils/lang";
import CustomPptBox from "@/components/common/CustomPptBox";
import CategoryShowcase from "@/components/products/CategoryShowcase";
import TrustStrip from "@/components/common/TrustStrip";

import HeroSection from "@/components/home/HeroSection";
import FeaturedSection from "@/components/home/FeaturedSection";
import BestsellersSection from "@/components/home/BestsellersSection";
import AboutSection from "@/components/home/AboutSection";
import StorySection from "@/components/home/StorySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";

interface HomeClientProps {
  initialAppearance: any;
  initialProducts: any[];
  initialReviews: any[];
  initialCategories: any[];
  isEditor?: boolean; // New prop for CMS preview mode
}

const PILLAR_COUNT = 3;

export default function HomeClient({ initialAppearance, initialProducts, initialReviews, initialCategories, isEditor = false }: HomeClientProps) {
  const { t, language } = useLanguage();
  const appearance = initialAppearance;
  const reviews = initialReviews;

  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [filterType] = useState<"all" | "free" | "paid">("all");
  const [priceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");
  const [ratingSort] = useState<"none" | "highest" | "lowest">("none");
  const [langFilter] = useState<"all" | "hindi" | "english">("all");
  const [categories, setCategories] = useState<any[]>(initialCategories || []);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategories?.[0]?.id || null);

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic Data Selection based on appearance
  const getFeaturedProducts = () => {
    if (appearance?.featured?.productIds?.length > 0) {
      return appearance.featured.productIds
        .map((id: string) => initialProducts.find(p => p.id === id))
        .filter(Boolean);
    }
    const explicitFeatured = initialProducts.filter(p => p.is_top9 || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_top9));
    return explicitFeatured.length > 0 
      ? explicitFeatured.slice(0, 12) 
      : initialProducts.filter(p => !(p.is_bestseller || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_bestseller))).slice(0, 12);
  };

  const getBestsellers = () => {
    if (appearance?.bestsellers?.productIds?.length > 0) {
      return appearance.bestsellers.productIds
        .map((id: string) => initialProducts.find(p => p.id === id))
        .filter(Boolean);
    }
    const explicitBestsellers = initialProducts.filter(p => p.is_bestseller || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_bestseller));
    return explicitBestsellers.length > 0 
      ? explicitBestsellers 
      : initialProducts.filter(p => !(p.is_top9 || (typeof p.title === 'object' && p.title !== null && (p.title as any).is_top9)));
  };

  const featuredProducts = getFeaturedProducts();
  const bestsellers = getBestsellers();

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

  const [activePillar, setActivePillar] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const [activeProduct, setActiveProduct] = useState(0);

  const productRef = useRef<HTMLDivElement>(null);
  const pillarRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

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
      if (productRef.current) {
        productIndex.current = (productIndex.current + 1) % Math.max(1, initialProducts.length - 1);
        const cardWidth = productRef.current.offsetWidth * 0.85 + 24;
        productRef.current.scrollTo({ left: productIndex.current * cardWidth, behavior: 'smooth' });
      }
      if (pillarRef.current) {
        pillarIndex.current = (pillarIndex.current + 1) % PILLAR_COUNT;
        const cardWidth = pillarRef.current.offsetWidth * 0.80 + 24;
        pillarRef.current.scrollTo({ left: pillarIndex.current * cardWidth, behavior: 'smooth' });
      }
      if (reviewRef.current) {
        reviewIndex.current = (reviewIndex.current + 1) % (reviews.length || 1);
        const cardWidth = reviewRef.current.offsetWidth * 0.85 + 24;
        reviewRef.current.scrollTo({ left: reviewIndex.current * cardWidth, behavior: 'smooth' });
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [reviews.length, initialProducts.length]);

  const sections: Record<string, React.ReactNode> = {
    hero: <HeroSection key="hero" appearance={appearance} t={t} language={language} handleScroll={handleScroll} />,
    trust: <TrustStrip key="trust" data={appearance?.trust} />,
    featured: <FeaturedSection key="featured" appearance={appearance} t={t} language={language} featuredProducts={featuredProducts} activeHeroIndex={activeHeroIndex} handleGridItemClick={handleGridItemClick} isLoading={categoriesLoading} reviews={reviews} />,
    bestsellers: <BestsellersSection key="bestsellers" appearance={appearance} t={t} language={language} bestsellers={bestsellers} isLoading={categoriesLoading} reviews={reviews} />,
    categories: (
      <CategoryShowcase 
        key="categories"
        products={initialProducts} 
        categories={categories} 
        language={language} 
        t={t} 
        isLoading={categoriesLoading}
      />
    ),
    customPpt: (
      <section id="custom-ppt" key="customPpt" className="py-20 md:py-28 relative overflow-hidden bg-[#09090B]">
        <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-[1px] bg-primary/30" />
              <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.5em] italic">Need Something Unique?</span>
              <div className="w-16 h-[1px] bg-primary/30" />
            </div>
          </div>
          <CustomPptBox />
        </div>
      </section>
    ),
    about: <AboutSection key="about" appearance={appearance} t={t} language={language} />,
    story: <StorySection key="story" appearance={appearance} t={t} language={language} pillarRef={pillarRef} />,
    testimonials: <TestimonialsSection key="testimonials" appearance={appearance} t={t} language={language} reviews={reviews} reviewRef={reviewRef} />,
    contact: <ContactSection key="contact" appearance={appearance} t={t} />,
  };

  const layoutOrder = appearance?.homepageLayout || [
    'hero', 'trust', 'featured', 'bestsellers', 'categories', 'customPpt', 'about', 'story', 'testimonials', 'contact'
  ];

  return (
    <div className={`overflow-hidden bg-background selection:bg-primary selection:text-black font-sans ${isEditor ? 'pointer-events-none' : ''}`}>
      <div className={`${isEditor ? 'absolute' : 'fixed'} inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]`} />
      
      {layoutOrder.map((sectionId: string) => {
        const isVisible = appearance?.sectionVisibility ? appearance.sectionVisibility[sectionId] !== false : true;
        if (!isVisible) return null;
        return sections[sectionId] || null;
      })}
    </div>
  );
}
