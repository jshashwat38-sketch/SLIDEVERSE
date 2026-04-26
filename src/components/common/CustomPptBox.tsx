"use client";

import { useState } from "react";
import { Sparkles, CheckCircle, CreditCard, Gift } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyPayment } from "@/actions/paymentActions";
import Script from "next/script";

interface CustomPptBoxProps {
  isCompact?: boolean;
}

export default function CustomPptBox({ isCompact = false }: CustomPptBoxProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!user) {
      toast.error("Authentication required to place a custom request.");
      router.push(`/signin?redirect=${typeof window !== "undefined" ? encodeURIComponent(window.location.pathname) : "/"}`);
      return;
    }

    if (typeof window === "undefined") return;

    if (!window.Razorpay) {
      toast.error("Payment gateway is initializing. Please retry in a moment.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast.error("Configuration missing.");
      return;
    }

    setLoading(true);

    try {
      const res = await createRazorpayOrder(200);
      if (!res.success || !res.order) {
        toast.error("Failed to create secure transaction.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Slideverse Pro",
        description: "Custom Premium PPT Request",
        order_id: res.order.id,
        handler: async function (response: any) {
          const verificationRes = await verifyPayment(response, {
            customer: user?.name || "Premium Client",
            email: user?.email || "client@slideverse.pro",
            product: "Custom Premium PPT Request",
            amount: 200,
          });

          if (verificationRes.success) {
            setIsPaid(true);
            toast.success("Transaction verified. Request submitted.");
          } else {
            toast.error("Payment validation failed.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#C5A572",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Process aborted due to technical issues.");
    } finally {
      setLoading(false);
    }
  };

  if (isPaid) {
    return (
      <div className={`bg-[#09090b] border border-primary/30 rounded-[2rem] p-8 flex flex-col items-center text-center gap-4 shadow-[0_0_20px_rgba(197,165,114,0.15)] ${isCompact ? "p-6 rounded-2xl border-primary/20 mt-4 mx-2" : "p-12 my-12"}`}>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <CheckCircle className="w-6 h-6 text-primary" />
        </div>
        <h3 className={`text-white font-black uppercase italic tracking-widest ${isCompact ? "text-xs" : "text-xl"}`}>Request Confirmed</h3>
        <p className={`text-zinc-400 font-medium ${isCompact ? "text-[9px] leading-tight" : "text-sm"}`}>Your custom PPT will be completed within 7 days.</p>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="bg-[#09090b] border border-white/5 rounded-2xl p-5 relative overflow-hidden flex flex-col gap-3 group hover:border-primary/20 transition-all mt-4 mx-2">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Custom PPT</h4>
        </div>
        <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">Get a professionally designed presentation tailored to your needs.</p>
        <button
          onClick={handleRequest}
          disabled={loading}
          className="w-full bg-primary hover:bg-white text-black py-2.5 rounded-xl font-black text-[9px] uppercase tracking-wider italic transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <CreditCard className="w-3 h-3" />
          {loading ? "Wait..." : "Pay ₹200 & Request"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#09090b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group hover:border-primary/20 transition-all max-w-5xl mx-auto shadow-2xl my-16">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] -mr-40 -mt-40 group-hover:bg-primary/10 transition-colors pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Gift className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Bespoke Production</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">Make Your Own <span className="text-primary neon-text">Premium PPT</span></h3>
          <p className="text-zinc-400 font-medium text-sm md:text-lg max-w-xl">Get a custom professionally designed presentation tailored to your needs.</p>
        </div>
        
        <div className="shrink-0 w-full md:w-auto">
          <button
            onClick={handleRequest}
            disabled={loading}
            className="w-full md:w-auto bg-gradient-to-br from-[#E8D5B5] via-[#C5A572] to-[#8A6D3B] text-black font-black text-base px-8 py-5 rounded-xl transition-all shadow-[0_15px_30px_-5px_rgba(197,165,114,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(197,165,114,0.5)] hover:-translate-y-0.5 uppercase tracking-widest italic flex items-center justify-center gap-3 border border-white/10 cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            {loading ? "Initializing..." : "Pay ₹200 & Request Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
