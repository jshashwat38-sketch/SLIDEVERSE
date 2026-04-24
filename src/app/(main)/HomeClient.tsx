"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Sparkles, Mail, Phone, Send, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { saveGrievance } from "@/actions/adminActions";
import { toast } from "react-hot-toast";
import { ProductCard, HeroProductCard } from "@/components/products/ProductCards";
import { useLanguage } from "@/context/LanguageContext";
import { getLangString } from "@/utils/lang";

interface HomeClientProps {
  initialAppearance: any;
  initialProducts: any[];
  initialReviews: any[];
}

const PILLAR_COUNT = 3;

export default function HomeClient({ initialAppearance, initialProducts, initialReviews }: HomeClientProps) {
  const { t, language } = useLanguage();
  const [appearance] = useState(initialAppearance);
  const bestsellerProducts = initialProducts.filter(p => p.is_bestseller);
  const [featuredProducts] = useState(bestsellerProducts);
  const [reviews] = useState(initialReviews);

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

  useEffect(() => {
    const timer = setInterval(() => {
      // Products
      if (productRef.current) {
        productIndex.current = (productIndex.current + 1) % Math.max(1, featuredProducts.length - 1);
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
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length, featuredProducts.length]);

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
          <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />
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
              {appearance?.hero?.badge || t("hero_badge")}
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 leading-[1.1] tracking-tight italic uppercase"
              dangerouslySetInnerHTML={{ 
                __html: (getLangString(appearance?.hero?.title, language) || t("hero_title"))
                  .replace(/Presentation Design/gi, '<span class="text-primary neon-text">Presentation Design</span>')
              }}
            />
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg md:text-xl text-zinc-400 mb-12 max-w-lg leading-relaxed font-medium tracking-normal"
            >
              {getLangString(appearance?.hero?.subtitle, language) || t("hero_subtitle")}
            </motion.p>
            
            <motion.div variants={itemVariants} className="hidden md:flex flex-col sm:flex-row items-center gap-6">
              <Link href={appearance?.buttons?.primary?.link || "#featured"} className="group relative w-full sm:w-auto">
                <button className="relative w-full sm:w-auto bg-primary hover:bg-white text-black px-10 py-5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 uppercase tracking-wider italic">
                  {appearance?.buttons?.primary?.label || t("explore_collection")} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link href={appearance?.buttons?.secondary?.link || "/signin"} className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-xl font-bold text-base transition-all border border-white/5 uppercase tracking-wider italic text-center">
                {appearance?.buttons?.secondary?.label || t("sign_in_securely")}
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
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Active Sectors</span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest italic opacity-80">Online Status</span>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
                {[
                  { name: "Archive", icon: Zap, link: "/#featured", code: "01" },
                  { name: "About", icon: Shield, link: "/#about", code: "02" },
                  { name: "Contact", icon: Send, link: "/#contact", code: "03" },
                  { name: "Vault", icon: Sparkles, link: "/account", code: "04" }
                ].map((btn, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <Link href={btn.link} className="shrink-0 w-28 aspect-square flex flex-col items-center justify-center bg-white/[0.03] border border-white/10 rounded-[2rem] group active:scale-95 transition-all relative overflow-hidden">
                      <div className="absolute top-3 left-3 text-[7px] font-black text-zinc-800">{btn.code}</div>
                      <btn.icon className="w-6 h-6 text-primary mb-2" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest italic">{btn.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/#featured" className="mt-2 flex items-center justify-between p-4 bg-primary border border-primary rounded-xl group active:scale-95 transition-all shadow-[0_10px_30px_rgba(197,165,114,0.2)]">
                  <span className="text-[9px] font-black text-black uppercase tracking-[0.2em] italic">Access Full Collection</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Decorative Hero Image Removed for Mobile and Desktop to Debug Artifact */}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section id="featured" className="py-20 md:py-32 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 tracking-tight italic uppercase">
                Featured <span className="text-primary">Gallery</span>
              </h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                Refined architectural frameworks for professional digital storytellers.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 space-y-24">
            {featuredProducts.length > 0 && <HeroProductCard {...featuredProducts[0]} />}
            
            {/* Mobile Product Carousel - Snap Scrolling with Auto-Motion */}
            <div 
              className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-4 pb-2 -mx-6 px-6 scrollbar-hide scroll-smooth"
              ref={productRef}
            >
              {featuredProducts.slice(1).map((product, index) => (
                <div key={product.id} className="min-w-[85vw] snap-center">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            {/* Desktop Grid Layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts.slice(1, 4).map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Us Section */}
      <section id="about" className="py-20 md:py-32 relative overflow-hidden bg-black/40">
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
                className="rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(197,165,114,0.1)] opacity-90 hover:opacity-100 transition-all duration-700" 
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
      <section id="story" className="py-24 md:py-40 bg-[#070708] relative overflow-hidden border-y border-white/5">
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
                className="relative z-10 rounded-[3.5rem] border border-white/10 shadow-2xl hover:scale-[1.02] transition-all duration-700" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-1"
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
      <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight italic uppercase">
              Client <span className="text-primary">Transmissions</span>
            </h2>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.3em] font-bold">Verified Intelligence from the Field</p>
          </motion.div>

          {/* Snap-Scroll Rotating Reviews - Mobile Optimized with No Clipping and Auto-Motion */}
          <div 
            className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-6 pb-4 -mx-6 px-6 scrollbar-hide scroll-smooth"
            ref={reviewRef}
          >
            {(reviews.length > 0 ? reviews : []).map((testimonial: any, i: number) => (
              <div 
                key={i}
                className="min-w-[85vw] snap-center bg-white/[0.03] backdrop-blur-sm p-12 rounded-[3.5rem] border border-white/5 relative flex flex-col justify-between min-h-[350px] shadow-2xl"
              >
                <div className="absolute top-10 right-10 text-primary/20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-8 leading-none">Feed // {testimonial.code}</div>
                  <p className="text-zinc-300 text-lg leading-relaxed font-medium italic mb-8">
                    "{getLangString(testimonial.text, language)}"
                  </p>
                </div>
                <div className="border-t border-white/5 pt-8">
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

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 relative border-t border-white/5">
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
                  <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className="text-lg md:text-xl text-white font-bold tracking-tight hover:text-primary transition-colors leading-tight">{appearance?.contact?.email || "support@slideverse.pro"}</a>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group">
                <a href={`tel:${(appearance?.contact?.mobile || "+91 8602328776").replace(/\s/g, '')}`} className="w-14 h-14 md:w-16 md:h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-all duration-500 group-hover:scale-110">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </a>
                <div className="flex flex-col justify-center">
                  <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] mb-1 leading-none">Secure Line</h3>
                  <a href={`tel:${(appearance?.contact?.mobile || "+91 8602328776").replace(/\s/g, '')}`} className="text-lg md:text-xl text-white font-bold tracking-tight hover:text-primary transition-colors leading-tight">{appearance?.contact?.mobile || "+91 8602328776"}</a>
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
                    <input name="name" type="text" required placeholder="ENTER NAME..." className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all placeholder:text-zinc-800" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] px-1">Relay Endpoint</label>
                    <input name="email" type="email" required placeholder="ENTER EMAIL..." className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all placeholder:text-zinc-800" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.5em] px-1">Intelligence Data</label>
                  <textarea name="message" required rows={5} placeholder="COMPOSE TRANSMISSION..." className="w-full bg-black/40 border border-white/5 rounded-xl px-6 py-4 text-white text-sm font-bold uppercase focus:outline-none focus:border-primary/40 focus:bg-black/60 transition-all placeholder:text-zinc-800 resize-none"></textarea>
                </div>
                <button type="submit" className="group relative w-full py-5 md:py-6 bg-primary overflow-hidden rounded-2xl transition-all shadow-[0_0_40px_rgba(197,165,114,0.2)] hover:shadow-[0_0_60px_rgba(197,165,114,0.4)] active:scale-[0.98]">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-4 text-black font-black text-lg md:text-xl uppercase tracking-[0.3em] italic leading-none">
                    <Send className="w-5 h-5 md:w-6 md:h-6 -rotate-12 group-hover:rotate-0 transition-transform" />
                    <span className="mt-1">Execute Broadcast</span>
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
