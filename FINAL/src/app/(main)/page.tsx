"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Sparkles, Mail, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts } from "@/actions/productActions";
import { getAppearance, getReviews } from "@/actions/adminActions";
import { ProductCard, HeroProductCard } from "@/components/products/ProductCards";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [appearance, setAppearance] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    getProducts().then(setFeaturedProducts);
    getAppearance().then(setAppearance);
    getReviews().then(setReviews);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="overflow-hidden bg-background selection:bg-primary selection:text-black font-sans">
      {/* Subtle Dynamic Scanline */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Hero Section - Refined */}
      <section className="relative pt-24 pb-32 min-h-[85vh] flex items-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          
          {/* Subtle Mesh Glows */}
          <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
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
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 leading-[1.1] tracking-tight italic uppercase"
              dangerouslySetInnerHTML={{ __html: appearance?.hero?.title || t("hero_title") }}
            />
            
            <motion.p 
              variants={itemVariants} 
              className="text-lg md:text-xl text-zinc-400 mb-12 max-w-lg leading-relaxed font-medium tracking-normal"
            >
              {appearance?.hero?.subtitle || t("hero_subtitle")}
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="#featured" className="group relative w-full sm:w-auto">
                <button className="relative w-full sm:w-auto bg-primary hover:bg-white text-black px-10 py-5 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3 uppercase tracking-wider italic">
                  {t("explore_collection")} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
              <Link href="/signin" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-xl font-bold text-base transition-all border border-white/5 uppercase tracking-wider italic text-center">
                {t("sign_in_securely")}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block lg:w-[90%] mx-auto"
          >
            <div className="relative z-10 group overflow-hidden rounded-[3rem] border border-white/5 bg-black/20 backdrop-blur-sm p-2">
              <img 
                src={appearance?.hero?.image || "/assets/hero_v3.png"} 
                alt="Elegant Tech Visual" 
                className="w-full h-auto object-cover rounded-[2.8rem] opacity-90 group-hover:opacity-100 transition-opacity duration-1000" 
              />
              {/* Refined Data Badge */}
              <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl z-20">
                <div className="text-primary font-bold italic uppercase tracking-tighter text-xl">{appearance?.hero?.badge || "Core.v3"}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section - Refined */}
      {featuredProducts.length > 0 && (
        <section id="featured" className="py-32 relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 tracking-tight italic uppercase">
                Elite <span className="text-primary">Acquisitions</span>
              </h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                Refined architectural frameworks for professional digital storytellers.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 space-y-24">
            <HeroProductCard {...featuredProducts[0]} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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

      {/* About Us Section - RESTORED IMAGE */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative lg:w-[110%] -ml-[5%]"
          >
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full" />
            <img 
              src={appearance?.about?.image || "/assets/hero_v2.png"} 
              alt="Elite Workspace" 
              className="relative z-10 rounded-[3rem] border border-white/5 shadow-2xl opacity-90 hover:opacity-100 transition-opacity" 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 
              className="text-4xl md:text-5xl font-heading font-bold text-white mb-8 tracking-tight italic uppercase"
              dangerouslySetInnerHTML={{ __html: appearance?.about?.title || 'The Digital <span class="text-primary">Atelier</span>' }}
            />
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed font-medium">
              {appearance?.about?.description || "We are a specialized laboratory of digital architects, dedicated to engineering the most sophisticated presentation frameworks in the modern era."}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="text-primary font-bold text-xl mb-2">99.9%</div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Precision Rate</div>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="text-primary font-bold text-xl mb-2">24/7</div>
                <div className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Tactical Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section - Expanded & Fuller */}
      <section id="story" className="py-32 bg-[#0C0C0E] relative overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative lg:order-2"
            >
              <img 
                src={appearance?.story?.image || "/assets/story_v2.png"} 
                alt="Creative Vision" 
                className="relative z-10 rounded-[3rem] border border-white/5 opacity-80 shadow-2xl" 
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-1"
            >
              <h2 
                className="text-4xl md:text-5xl font-heading font-bold text-white mb-8 tracking-tight italic uppercase leading-tight"
                dangerouslySetInnerHTML={{ __html: appearance?.story?.title || `The Genesis <br /> <span class="text-primary">Philosophy</span>` }}
              />
              <p className="text-xl text-zinc-400 mb-12 leading-relaxed font-medium italic border-l-4 border-primary pl-8 py-2">
                {appearance?.story?.subtitle || t("story_subtitle")}
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                  <h4 className="text-xl font-heading font-bold text-white mb-4 uppercase tracking-widest italic flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary" /> {t("born_need")}
                  </h4>
                  <p className="text-zinc-500 leading-relaxed text-base">{t("born_need_desc")}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Fuller Component: Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Architectural Integrity", desc: "Every slide is built on a foundation of structural perfection." },
              { title: "Cinematic Motion", desc: "Transitions that bridge the gap between presentation and cinema." },
              { title: "Tactical Delivery", desc: "Engineered for high-stakes environments where clarity is paramount." }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-center"
              >
                <div className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4">Pillar {i+1}</div>
                <h4 className="text-white font-bold text-xl mb-4 italic uppercase">{pillar.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Client Transmissions */}
      <section id="testimonials" className="py-32 relative overflow-hidden bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 tracking-tight italic uppercase">
              Client <span className="text-primary">Transmissions</span>
            </h2>
            <p className="text-sm text-zinc-500 uppercase tracking-[0.3em] font-bold">Verified Intelligence from the Field</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(reviews.length > 0 ? reviews : [
              { 
                name: "AR. VIKRAM SETH", 
                role: "LEAD ARCHITECT", 
                text: "The structural precision of these templates is unparalleled. It's not just a slide; it's a blueprint for successful delivery.",
                code: "SIGMA-01"
              },
              { 
                name: "SARAH CHEN", 
                role: "CREATIVE DIRECTOR", 
                text: "Finally, a platform that understands the intersection of high-stakes business and cinematic storytelling.",
                code: "SIGMA-02"
              },
              { 
                name: "MARCUS VANCE", 
                role: "VENTURE PARTNER", 
                text: "In the world of high-value acquisitions, clarity is everything. Slideverse provides the tactical edge we need.",
                code: "SIGMA-03"
              }
            ]).map((testimonial: any, i: number) => (
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
                  "{typeof testimonial.text === 'object' ? (testimonial.text[language] || testimonial.text.en) : testimonial.text}"
                </p>
                <div className="border-t border-white/5 pt-8">
                  <div className="text-white font-bold text-sm uppercase tracking-widest">
                    {typeof testimonial.name === 'object' ? (testimonial.name[language] || testimonial.name.en) : testimonial.name}
                  </div>
                  <div className="text-primary text-[9px] font-bold uppercase tracking-[0.3em] mt-1">
                    {typeof testimonial.role === 'object' ? (testimonial.role[language] || testimonial.role.en) : testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Fuller & Perfected */}
      <section id="contact" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* Contact Details Panel */}
            <div className="lg:col-span-1 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-heading font-bold text-white mb-4 tracking-tight italic uppercase">
                  Initiate <span className="text-primary">Contact</span>
                </h2>
                <p className="text-xs text-zinc-500 uppercase tracking-[0.3em] font-bold mb-10">{t("here_to_help")}</p>
                
                <div className="space-y-10">
                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Email Relay</div>
                      <div className="text-lg text-white font-bold tracking-tight">ops@slideverse.pro</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Direct Frequency</div>
                      <div className="text-lg text-white font-bold tracking-tight">+1 (800) SLIDEVERSE</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Broadcast Terminal Panel */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-card/30 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/5 shadow-2xl"
              >
                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.4em] ml-2">Identity Code</label>
                      <input type="text" placeholder="NAME..." className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.4em] ml-2">Relay Endpoint</label>
                      <input type="email" placeholder="EMAIL..." className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.4em] ml-2">Transmission Data</label>
                    <textarea rows={4} placeholder="ENTER BROADCAST..." className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800 resize-none"></textarea>
                  </div>
                  <button className="group relative w-full py-5 bg-primary overflow-hidden rounded-xl transition-all shadow-xl hover:shadow-primary/20">
                    <span className="relative z-10 flex items-center justify-center gap-4 text-black font-bold text-lg uppercase tracking-[0.2em] italic">
                      <Send className="w-5 h-5" />
                      Execute Broadcast
                    </span>
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
