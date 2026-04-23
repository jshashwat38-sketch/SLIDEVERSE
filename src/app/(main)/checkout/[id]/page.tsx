"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ArrowLeft, Lock, ShieldCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/actions/productActions";
import { validateEmail } from "@/utils/validation";
import { verifyEmailDomain } from "@/actions/validationActions";
import { createRazorpayOrder, verifyPayment } from "@/actions/paymentActions";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { saveFailedOrder } from "@/actions/orderActions";
import LogoLoader from "@/components/common/LogoLoader";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const products = await getProducts();
        const found = products.find((p: any) => p.id === id);
        if (found) {
          setProduct(found);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const productPrice = product?.price || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || "Invalid Email");
      return;
    }

    setIsSubmitting(true);

    const serverValidation = await verifyEmailDomain(formData.email);
    if (!serverValidation.isValid) {
      setError(serverValidation.error || "Email verification failed.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const res = await createRazorpayOrder(productPrice);
      if (!res.success || !res.order) {
        setError("Failed to initialize secure payment.");
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Slideverse Pro",
        description: `Acquisition of ${product.title}`,
        order_id: res.order.id,
        handler: async function (response: any) {
          setIsSubmitting(true);
          const verificationRes = await verifyPayment(response, {
            customer: formData.name,
            email: formData.email,
            product: product.title,
            amount: product.price,
          });
          
          if (verificationRes.success) {
            toast.success("Asset acquired successfully. Transferring to vault...");
            router.push("/success");
          } else {
            setError("Payment verification failed.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#FFD700",
        },
        modal: {
          ondismiss: async function() {
            setIsSubmitting(false);
            toast.error("Acquisition sequence paused. Please complete your payment in your vault.");
            await saveFailedOrder({
              customer: formData.name,
              email: formData.email,
              product: product.title,
              amount: product.price,
              product_id: product.id
            });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', async function (response: any) {
        toast.error("Security sequence interrupted. Please complete your payment.");
        await saveFailedOrder({
          customer: formData.name,
          email: formData.email,
          product: product.title,
          amount: product.price,
          product_id: product.id
        });
        setIsSubmitting(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      setError("Could not launch payment gateway.");
      await saveFailedOrder({
        customer: formData.name,
        email: formData.email,
        product: product.title,
        amount: product.price,
        product_id: product.id
      });
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-32 flex flex-col items-center justify-center space-y-4">
        <LogoLoader />
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-32 text-center px-6">
        <h1 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">Asset Not Found</h1>
        <Link href="/" className="text-primary font-black hover:underline uppercase tracking-widest text-[10px] italic border border-primary/20 px-6 py-3 rounded-xl bg-primary/5">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-10 transition-colors text-[9px] font-black uppercase tracking-[0.3em] italic group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </Link>

      <div className="bg-[#09090B] rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="md:flex">
          {/* Order Summary */}
          <div className="md:w-1/3 bg-white/[0.02] p-10 border-r border-white/5">
            <h2 className="text-2xl font-black text-white mb-8 uppercase italic tracking-widest">Summary</h2>
            <div className="space-y-8 mb-10">
              <div className="flex flex-col gap-2">
                <span className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px] italic">Target Asset</span>
                <span className="font-black text-white uppercase italic text-lg group-hover:text-primary transition-colors leading-tight">{product.title}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-zinc-600 font-black uppercase tracking-[0.2em] text-[10px] italic">Deployment Fee</span>
                <span className="font-black text-primary uppercase italic text-sm tracking-widest">Included</span>
              </div>
            </div>
            <div className="pt-10 border-t border-white/10">
              <div className="flex flex-col gap-3">
                <span className="font-black text-zinc-600 uppercase tracking-[0.3em] text-[11px] italic">Final Valuation</span>
                <span className="font-black text-5xl text-white italic tracking-tighter">₹{productPrice}</span>
              </div>
            </div>
            
            <div className="mt-12 flex items-center text-[8px] text-zinc-600 gap-3 font-black uppercase tracking-[0.2em] italic">
              <ShieldCheck className="w-4 h-4 text-primary opacity-60" />
              <span>Secure Acquisition Active</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="md:w-2/3 p-10 relative overflow-hidden">
            <h1 className="text-3xl font-black text-white mb-8 uppercase italic tracking-tighter">Deployment Details</h1>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="name" className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4 italic">Operative Identity</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 focus:bg-black transition-all placeholder:text-zinc-800 italic"
                  placeholder="ENTER NAME..."
                />
              </div>
              
              <div className="space-y-3">
                <label htmlFor="email" className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4 italic">Secure Endpoint</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 focus:bg-black transition-all placeholder:text-zinc-800 italic"
                  placeholder="ENTER EMAIL..."
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="phone" className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-4 italic">Comm Link</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 focus:bg-black transition-all placeholder:text-zinc-800 italic"
                  placeholder="+91..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-white text-black font-black py-6 px-4 rounded-2xl flex justify-center items-center gap-4 transition-all mt-10 disabled:opacity-50 uppercase tracking-[0.2em] text-lg italic shadow-[0_0_30px_rgba(212,255,0,0.2)]"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Finalize Acquisition
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
