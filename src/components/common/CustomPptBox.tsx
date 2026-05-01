"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle, CreditCard, Gift, ArrowRight, Upload, Calendar, Layers, Palette, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyPayment } from "@/actions/paymentActions";
import { getAppearance } from "@/actions/adminActions";
import Script from "next/script";

interface CustomPptBoxProps {
  isCompact?: boolean;
}

export default function CustomPptBox({ isCompact = false }: CustomPptBoxProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [appearance, setAppearance] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    topic: "",
    slides: "10-15",
    purpose: "business",
    language: "english",
    deadline: "",
    style: "modern",
    notes: ""
  });

  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    getAppearance().then(setAppearance);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentPrice = appearance?.customPpt?.price || 200;
  const isEnabled = appearance?.customPpt?.enabled !== false;
  const timelineText = appearance?.customPpt?.timelineText || "Your custom PPT will be completed within the promised timeline.";

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Authentication required to place a custom request.");
      router.push(`/signin?redirect=${typeof window !== "undefined" ? encodeURIComponent(window.location.pathname) : "/"}`);
      return;
    }

    if (!formData.fullName || !formData.email || !formData.topic || !formData.deadline) {
      toast.error("Please fill in all mandatory parameters.");
      return;
    }

    if (typeof window === "undefined") return;

    if (!window.Razorpay) {
      toast.error("Payment gateway initializing. Retry momentarily.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      toast.error("Checkout configuration offline.");
      return;
    }

    setLoading(true);

    try {
      const res = await createRazorpayOrder(currentPrice);
      if (!res.success || !res.order) {
        toast.error("Failed to generate order voucher.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "Slideverse Studio",
        description: `Custom PPT Request: ${formData.topic.substring(0, 30)}`,
        order_id: res.order.id,
        handler: async function (response: any) {
          const verificationRes = await verifyPayment(response, {
            customer: formData.fullName,
            email: formData.email,
            product: `CUSTOM_PPT_SPECS|${JSON.stringify({
              ...formData,
              fileName,
              fileAttached: !!fileBase64,
              orderStatus: "New Request",
              dateSubmitted: new Date().toISOString()
            })}`,
            amount: currentPrice,
          });

          if (verificationRes.success) {
            setOrderId(response.razorpay_payment_id || response.razorpay_order_id || "SV-CUST-" + Date.now().toString().slice(-6));
            setIsPaid(true);
            toast.success("Transaction verified. Details indexed.");
          } else {
            toast.error("Payment validation failed.");
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone || ""
        },
        theme: {
          color: "#C5A572",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Checkout aborted via hardware interruption.");
    } finally {
      setLoading(false);
    }
  };

  if (!isEnabled) return null;

  if (isPaid) {
    return (
      <div className={`bg-[#09090b] border border-primary/30 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center text-center gap-6 shadow-[0_0_40px_rgba(197,165,114,0.15)] max-w-2xl mx-auto my-12 animate-in fade-in duration-500 border-t-4 border-t-primary`}>
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(197,165,114,0.3)] animate-bounce">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-white font-black uppercase italic tracking-widest text-2xl">Request Confirmed Successfully</h3>
          <p className="text-primary font-black text-xs uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 inline-block mt-2">Request ID: {orderId}</p>
        </div>
        <p className="text-zinc-400 font-medium text-sm leading-relaxed max-w-md">
          Further details and next steps will be shared to your registered email address ({formData.email}).
        </p>
        <div className="h-[1px] w-full bg-white/5 my-2" />
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest italic">{timelineText}</p>
      </div>
    );
  }

  if (isCompact) {
    return (
      <div className="bg-card border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col gap-3 group hover:border-primary/20 transition-all mt-4 mx-2">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Custom PPT Suite</h4>
        </div>
        <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">Specify project details and commission custom masterclasses.</p>
        
        {/* Simple Redirection Button for Compact */}
        <button
          onClick={() => {
            const element = document.getElementById("custom-ppt-form-section");
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
              router.push("/shop");
            }
          }}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-black text-[9px] uppercase tracking-wider italic transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Palette className="w-3 h-3" />
          Configure Specs (₹{currentPrice})
        </button>
      </div>
    );
  }

  return (
    <div id="custom-ppt-form-section" className="bg-card border border-white/10 rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden group hover:border-primary/10 transition-all w-[94%] max-w-[1500px] mx-auto shadow-2xl my-16 border-t-2 border-t-primary/30">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:bg-primary/10 transition-colors pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-start justify-between gap-12 lg:gap-[48px] relative z-10">
        {/* Left Informative Panel */}
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Bespoke slide mechanics</span>
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6 leading-[1.1]">Make Your Own <br /><span className="text-primary neon-text">Premium PPT</span></h3>
          <p className="text-zinc-400 font-medium text-sm md:text-base leading-relaxed mb-8">
            Get a custom professionally designed presentation tailored to your exact operational requirements. 
          </p>

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">₹</div>
              <div>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">Premium Flat Rate</span>
                <span className="text-2xl font-black text-white italic">₹{currentPrice}</span>
                {appearance?.customPpt?.mrpPrice && (
                  <span className="text-zinc-600 text-sm line-through font-bold ml-2">₹{appearance?.customPpt?.mrpPrice}</span>
                )}
              </div>
            </div>
            <div className="h-[1px] bg-white/5" />
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-zinc-600" />
              <p className="text-xs text-zinc-400 font-semibold">{timelineText}</p>
            </div>
          </div>
        </div>

        {/* Right Input Form */}
        <form onSubmit={handleRequest} className="w-full bg-background/40 border border-white/10 rounded-[2rem] p-6 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Full Name *</label>
              <input 
                name="fullName" 
                type="text" 
                required 
                value={formData.fullName}
                onChange={handleChange}
                placeholder="ENTER FULL NAME..." 
                className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-zinc-400" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Email Endpoint *</label>
              <input 
                name="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                placeholder="ENTER EMAIL ADDRESS..." 
                className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-white text-xs font-bold focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-zinc-400" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Phone Protocol (Optional)</label>
              <input 
                name="phone" 
                type="text" 
                value={formData.phone}
                onChange={handleChange}
                placeholder="MOBILE NUMBER..." 
                className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-white text-xs font-bold focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-zinc-400" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">PPT Topic / Title *</label>
              <input 
                name="topic" 
                type="text" 
                required 
                value={formData.topic}
                onChange={handleChange}
                placeholder="PRESENTATION TOPIC..." 
                className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-zinc-400" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Slide Count Requirement *</label>
              <select 
                name="slides" 
                required 
                value={formData.slides}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-zinc-400 text-xs font-bold uppercase focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
              >
                <option value="10-15">10 - 15 Slides</option>
                <option value="15-25">15 - 25 Slides</option>
                <option value="25-40">25 - 40 Slides</option>
                <option value="40+">40+ Slides</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Purpose of PPT *</label>
              <select 
                name="purpose" 
                required 
                value={formData.purpose}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-zinc-400 text-xs font-bold uppercase focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
              >
                <option value="business">Business Proposal</option>
                <option value="college">College / Academic</option>
                <option value="pitch">Pitch Deck / Funding</option>
                <option value="marketing">Sales / Marketing</option>
                <option value="seminar">Seminar / Webinar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Preferred Language *</label>
              <select 
                name="language" 
                required 
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-zinc-400 text-xs font-bold uppercase focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
              >
                <option value="english">English (Global)</option>
                <option value="hindi">Hindi (हिन्दी)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Needed By / Deadline *</label>
              <input 
                name="deadline" 
                type="date" 
                required 
                value={formData.deadline}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-zinc-400 text-xs font-bold focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Design Style Preference *</label>
            <select 
              name="style" 
              required 
              value={formData.style}
              onChange={handleChange}
              className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-zinc-400 text-xs font-bold uppercase focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
            >
              <option value="modern">Modern & Clean</option>
              <option value="corporate">Corporate & Professional</option>
              <option value="luxury">Luxury / Champagne Gold</option>
              <option value="minimal">Ultra-Minimalist</option>
              <option value="creative">Bold & Creative</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Extra Requirements / Asset Notes</label>
            <textarea 
              name="notes" 
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              placeholder="SPECIFY ANY FONTS, ATTACHMENTS, OR PREFERENCES..." 
              className="w-full bg-background border border-white/10 rounded-xl px-5 py-3.5 text-white text-xs font-bold uppercase focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-zinc-500 resize-none"
            />
          </div>

          {/* Reference Document Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Optional Reference Guides / Logo Docs</label>
            <div className="relative border border-white/10 bg-background rounded-xl px-5 py-4 flex items-center justify-between group-hover:border-primary/10 transition-colors">
              <div className="flex items-center gap-3">
                <Upload className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-zinc-400 truncate max-w-[200px]">
                  {fileName || "Click to upload files..."}
                </span>
              </div>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <span className="text-[9px] font-black text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-md border border-primary/20">Browse</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] text-white font-black text-xs py-4 px-8 rounded-xl uppercase tracking-[0.2em] italic flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <CreditCard className="w-4 h-4" />
            {loading ? "Vouching..." : `Order Custom PPT – ₹${currentPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
}
