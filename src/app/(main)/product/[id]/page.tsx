"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Globe, 
  CreditCard,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { getProducts } from "@/actions/productActions";
import { createRazorpayOrder, verifyPayment } from "@/actions/paymentActions";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { getLangString } from "@/utils/lang";
import LogoLoader from "@/components/common/LogoLoader";


declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();

  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const products = await getProducts();
      const foundProduct = products.find((p: any) => p.id === id);
      setProduct(foundProduct);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LogoLoader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-6">Asset Not Found</h1>
        <p className="text-zinc-500 max-w-md mb-10 font-medium">The requested product entity does not exist in our secure repository.</p>
        <button 
          onClick={() => router.push("/")}
          className="bg-primary hover:bg-primary-hover text-black px-10 py-4 rounded-2xl font-black transition-all uppercase tracking-widest"
        >
          Return to Grid
        </button>
      </div>
    );
  }

  const allImages = product.images || [product.imageUrl];
  const faqs = product.faqs || [];

  const handleAddToCart = () => {
    addToCart({ 
      id: product.id, 
      title: getLangString(product.title, language), 
      price: product.price, 
      imageUrl: allImages[0] 
    });
  };

  const handleAcquire = async () => {
    if (!user) {
      toast.error("Authentication required for acquisition.");
      router.push(`/signin?redirect=/product/${id}`);
      return;
    }

    if (typeof window === "undefined") return;


    if (!window.Razorpay) {
      toast.error("Payment gateway is still initializing. Please wait a moment.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast.error("Payment configuration missing. Contact administrator.");
      console.error("NEXT_PUBLIC_RAZORPAY_KEY_ID is not defined");
      return;
    }

    try {
      const res = await createRazorpayOrder(product.price);
      if (!res.success || !res.order) {
        toast.error("Failed to initialize secure payment.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Slideverse Pro",
        description: `Acquisition of ${getLangString(product.title, language)}`,
        order_id: res.order.id,
        handler: async function (response: any) {
          const verificationRes = await verifyPayment(response, {
            customer: user?.name || "Verified Curator",
            email: user?.email || "curator@slideverse.pro",
            product: getLangString(product.title, language),
            amount: product.price,
          });

          
          if (verificationRes.success) {
            toast.success("Asset acquired successfully. Transferring to vault...");
            router.push("/success");
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#FFD700",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Could not launch payment gateway.");
    }
  };



  return (
    <div className="min-h-screen bg-[#09090B] text-white pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-12 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Sector</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-white/[0.02] rounded-[3rem] overflow-hidden border border-white/5 relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={allImages[activeImage] || "https://placehold.co/600x400?text=No+Image"}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/800x1000?text=No+Image";
                  }}
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent opacity-40" />

              {allImages.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                  {allImages.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${activeImage === i ? 'bg-primary w-8' : 'bg-white/20 hover:bg-white/40'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-6 gap-4">
              {allImages.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary shadow-[0_0_15px_rgba(197, 165, 114, 0.3)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  <img 
                    src={img || "https://placehold.co/600x400?text=No+Image"} 
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" 
                    alt="" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[1px] bg-primary/40" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Secure Asset Deployment</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">
              {typeof product.title === 'object' ? (product.title.en || Object.values(product.title)[0]) : product.title}
            </h1>
            
            <div className="flex items-center gap-6 mb-12 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem]">
              <div className="flex flex-col">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Market Valuation</span>
                <span className="text-4xl font-black text-white italic tracking-tighter italic">₹{product.price}</span>
              </div>
              <div className="h-12 w-[1px] bg-white/5 mx-4" />
              <div className="flex flex-col">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Status</span>
                <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Live Deployment
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-lg mb-12 leading-relaxed font-medium">
              {typeof product.description === 'object' ? (product.description.en || Object.values(product.description)[0]) : product.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {(product.features || []).map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest group-hover:text-zinc-200 transition-colors">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-auto">
              <button 
                onClick={handleAcquire}
                className="flex-1 bg-primary hover:bg-primary-hover text-black px-10 py-6 rounded-3xl font-black text-xl transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 uppercase tracking-widest italic"
              >
                Acquire Asset
              </button>
              <button 
                onClick={handleAddToCart}
                className="px-10 py-6 rounded-3xl font-black text-xs text-white border border-white/10 hover:bg-white/5 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Stage to Vault
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-12 border-t border-white/5 pt-12">
              <div className="flex flex-col items-center text-center gap-3">
                <ShieldCheck className="w-6 h-6 text-zinc-700" />
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Secure Cloud Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Zap className="w-6 h-6 text-zinc-700" />
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Instant Activation</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Globe className="w-6 h-6 text-zinc-700" />
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Global Ownership</span>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Matrix (FAQs) Section */}
        {faqs.length > 0 && (
          <div className="mt-40">
            <div className="flex flex-col items-center text-center mb-20">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-primary/40" />
                <span className="text-[12px] font-black text-primary uppercase tracking-[0.4em] italic">Intelligence Matrix</span>
                <div className="h-[1px] w-12 bg-primary/40" />
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter">Frequently Asked <span className="text-primary neon-text">Queries</span></h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {(product.faqs || []).map((faq: any, i: number) => (
                <div 
                  key={i}
                  className={`bg-[#09090B] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedFaq === i ? 'border-primary/20 bg-white/[0.02]' : 'hover:border-white/20'}`}
                >
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full px-10 py-8 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${expandedFaq === i ? 'bg-primary text-black border-primary' : 'bg-white/5 text-zinc-500 border-white/10 group-hover:border-primary/30'}`}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className={`text-lg font-black uppercase tracking-tight italic transition-colors ${expandedFaq === i ? 'text-primary' : 'text-white'}`}>{faq.question}</span>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-zinc-700 transition-transform duration-500 ${expandedFaq === i ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] as any }}
                      >
                        <div className="px-10 pb-10 ml-16">
                          <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[1.5rem]">
                            <p className="text-zinc-400 text-lg font-medium leading-relaxed italic">
                              "{faq.answer}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
