"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/actions/productActions";
import { validateEmail } from "@/utils/validation";
import { verifyEmailDomain } from "@/actions/validationActions";
import { motion } from "framer-motion";

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

    // 1. Client-side validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error || "Invalid Email");
      return;
    }

    setIsSubmitting(true);

    // 2. Server-side verification (MX records)
    const serverValidation = await verifyEmailDomain(formData.email);
    if (!serverValidation.isValid) {
      setError(serverValidation.error || "Email verification failed.");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call to create order
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to success page
    router.push("/success");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-32 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Syncing Asset Data...</p>
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-32 text-center">
        <h1 className="text-2xl font-bold text-white mb-4 uppercase italic">Asset Not Found</h1>
        <Link href="/" className="text-primary font-bold hover:underline uppercase tracking-widest text-xs">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Catalog
      </Link>

      <div className="bg-[#09090B] rounded-[2rem] shadow-2xl border border-white/5 overflow-hidden">
        <div className="md:flex">
          {/* Order Summary */}
          <div className="md:w-1/3 bg-white/[0.02] p-8 border-r border-white/5">
            <h2 className="text-lg font-bold text-white mb-6 uppercase italic">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-medium">Asset</span>
                <span className="font-bold text-white uppercase italic text-xs">{product.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-medium">Taxes</span>
                <span className="font-bold text-white uppercase italic text-xs">Included</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between">
                <span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Total Valuation</span>
                <span className="font-bold text-2xl text-primary italic">₹{productPrice}</span>
              </div>
            </div>
            
            <div className="mt-8 flex items-center text-[10px] text-zinc-500 gap-2 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Secure Acquisition protocol active.</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="md:w-2/3 p-8">
            <h1 className="text-2xl font-bold text-white mb-6 uppercase italic tracking-tighter">Secure Asset Deployment</h1>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em] ml-2">Identity Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800"
                  placeholder="NAME..."
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em] ml-2">Secure Endpoint</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800"
                  placeholder="EMAIL..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em] ml-2">Communication Link</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-800"
                  placeholder="+91..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-white text-black font-black py-5 px-4 rounded-xl flex justify-center items-center gap-3 transition-all mt-8 disabled:opacity-70 uppercase tracking-widest text-sm italic shadow-[0_0_20px_rgba(212,255,0,0.2)]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Finalize Acquisition - ₹{productPrice}
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
