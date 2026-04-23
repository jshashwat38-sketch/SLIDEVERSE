"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, PlusCircle, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyPayment } from "@/actions/paymentActions";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { saveFailedOrder } from "@/actions/orderActions";
import { getLangString } from "@/utils/lang";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Authentication required for acquisition.");
      router.push("/signin?redirect=/cart");
      return;
    }

    if (items.length === 0) return;

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

    setIsProcessing(true);
    try {
      const res = await createRazorpayOrder(totalPrice);
      if (!res.success || !res.order) {
        toast.error("Failed to initialize secure payment.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Slideverse Pro",
        description: `Acquisition of ${totalItems} premium assets`,
        order_id: res.order.id,
        handler: async function (response: any) {
          setIsProcessing(true);
          const verificationRes = await verifyPayment(response, {
            customer: user.name || "Verified Curator",
            email: user.email,
            product: items.map(i => `${i.title} (x${i.quantity})`).join(", "),
            amount: totalPrice,
          });
          
          if (verificationRes.success) {
            toast.success("Assets acquired successfully. Transferring to vault...");
            clearCart();
            router.push("/success");
          } else {
            toast.error("Payment verification failed.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.name || "",
          email: user.email || "",
        },
        theme: {
          color: "#D4FF00",
        },
        modal: {
          ondismiss: async function() {
            setIsProcessing(false);
            toast.error("Acquisition sequence paused. Please complete your payment in your vault.");
            await saveFailedOrder({
              customer: user.name || "Verified Curator",
              email: user.email,
              product: items.map(i => `${i.title} (x${i.quantity})`).join(", "),
              amount: totalPrice,
              product_id: items[0].id
            });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', async function (response: any) {
        toast.error("Security sequence interrupted. Please complete your payment.");
        await saveFailedOrder({
          customer: user.name || "Verified Curator",
          email: user.email,
          product: items.map(i => `${i.title} (x${i.quantity})`).join(", "),
          amount: totalPrice,
          product_id: items[0].id // Simplified for single product primary link
        });
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error("Could not launch payment gateway.");
      await saveFailedOrder({
        customer: user.name || "Verified Curator",
        email: user.email,
        product: items.map(i => `${i.title} (x${i.quantity})`).join(", "),
        amount: totalPrice,
        product_id: items[0].id
      });
      setIsProcessing(false);
    }
  };


  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10"
        >
          <ShoppingBag className="w-16 h-16 text-zinc-700" />
        </motion.div>
        
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter italic uppercase">Vault is Empty</h1>
        <p className="text-zinc-500 mb-10 max-w-md font-medium uppercase tracking-widest text-xs leading-relaxed italic">
          No premium assets currently staged for acquisition. Explore our elite collection to begin.
        </p>
        
        <Link 
          href="/" 
          className="bg-primary hover:bg-white text-black px-10 py-4 rounded-2xl font-black transition-all shadow-[0_0_30px_rgba(212,255,0,0.2)] hover:shadow-[0_0_50px_rgba(212,255,0,0.4)] uppercase tracking-widest text-sm italic"
        >
          Access Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-6xl mx-auto py-12 px-4 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Acquisition Staging</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Your Vault</h1>
        </div>
        <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5 italic">
          {totalItems} Assets Staged
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                key={item.id} 
                className="bg-[#09090B] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 flex flex-col sm:flex-row gap-8 items-center group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors">
                  <img 
                    src={item.imageUrl || "https://placehold.co/600x400?text=No+Image"} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=No+Image";
                    }}
                  />
                </div>
                
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tighter italic uppercase group-hover:text-primary transition-colors leading-none">
                        {getLangString(item.title, language)}
                      </h3>
                      <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2 mt-2">
                        <Zap className="w-3 h-3 text-primary" />
                        Instant Deployment Delivery
                      </p>
                    </div>
                    <div className="text-2xl font-black text-white italic tracking-tighter">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white/[0.02] rounded-2xl p-3 border border-white/5">
                    <div className="flex items-center gap-4 px-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-white text-sm w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-600 hover:text-red-500 transition-all p-3 hover:bg-red-500/10 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center sm:justify-start pt-4"
          >
            <Link 
              href="/" 
              className="group flex items-center gap-4 px-8 py-6 rounded-[2rem] border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all w-full max-w-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-white font-black text-sm uppercase italic tracking-widest leading-none">Stage More Assets</span>
                <span className="block text-zinc-600 text-[8px] font-bold uppercase tracking-widest mt-2 italic">Enhance your collection further</span>
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#09090B] rounded-[3rem] p-10 shadow-2xl border border-white/5 sticky top-28 overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            <h2 className="text-3xl font-black text-white mb-10 tracking-tighter italic uppercase leading-none">Valuation Summary</h2>
            
            <div className="space-y-8 text-sm mb-12">
              <div className="flex justify-between items-center text-zinc-500 font-black uppercase tracking-widest text-xs italic">
                <span>Total Asset Count</span>
                <span className="text-white text-xl">{totalItems}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-500 font-black uppercase tracking-widest text-xs italic">
                <span>Sub-Valuation</span>
                <span className="text-white text-xl">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-500 font-black uppercase tracking-widest text-xs italic">
                <span>Deployment Fee</span>
                <span className="text-primary text-xl font-black">FREE</span>
              </div>
            </div>
            
            <div className="pt-10 border-t border-white/10 mb-12 flex justify-between items-end">
              <div className="space-y-2">
                <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Final Total Valuation</span>
                <span className="block text-6xl font-black text-white italic tracking-tighter leading-none">₹{totalPrice}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-white text-black py-6 rounded-2xl font-black text-lg transition-all shadow-[0_0_30px_rgba(197,165,114,0.2)] hover:shadow-[0_0_50px_rgba(197,165,114,0.4)] hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-widest italic group disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : (
                <>
                  Proceed to Acquisition
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-3 px-6 py-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <ShieldCheck className="w-5 h-5 text-primary opacity-60" />
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest italic">End-to-End Encryption Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
