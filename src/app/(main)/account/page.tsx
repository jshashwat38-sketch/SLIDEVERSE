"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getUserOrders } from "@/actions/orderActions";
import { getProducts } from "@/actions/productActions";
import { ShoppingBag, ExternalLink, AlertCircle, Clock, CheckCircle2, ShieldCheck, Download, Zap } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LogoLoader from "@/components/common/LogoLoader";

export default function AccountPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      Promise.all([
        getUserOrders(user.email),
        getProducts()
      ]).then(([ordersData, productsData]) => {
        setOrders(ordersData);
        setProducts(productsData);
        setIsLoading(false);
      });
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LogoLoader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Access Restricted</h1>
          <p className="text-zinc-500 font-medium italic">Please establish a secure connection to view your digital vault.</p>
          <Link href="/signin">
            <button className="w-full bg-primary text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(197,165,114,0.3)]">
              Sign In Securely
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] italic">Member Archive</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
              The <span className="text-primary">Vault</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-xl font-medium italic">
              Welcome back, {user.name}. Your acquired professional assets and acquisition history are secured below.
            </p>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl hidden md:block">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Secure Identity</div>
            <div className="text-white font-bold">{user.email}</div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-primary" />
              Your Acquisitions
            </h2>
            <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">
              {orders.length} Records Found
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {orders.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] p-20 text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto border border-white/5">
                    <ShoppingBag className="w-8 h-8 text-zinc-700" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase italic">Vault is Empty</h3>
                    <p className="text-zinc-500 text-sm italic">You haven't acquired any professional assets yet.</p>
                  </div>
                  <Link href="/#featured">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/10">
                      Explore Marketplace
                    </button>
                  </Link>
                </motion.div>
              ) : (
                orders.map((order, idx) => {
                  const product = products.find(p => p.id === order.product_id || p.id === order.product);
                  const isSuccess = order.status === "success" || order.status === "completed";
                  const isFailed = order.status === "failed" || order.status === "cancelled";

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-primary/20 rounded-[2rem] p-8 transition-all relative overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
                        {/* Product Info */}
                        <div className="flex items-center gap-6 flex-1">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/5">
                            <img 
                              src={product?.image_url || "https://placehold.co/400x400?text=Asset"} 
                              alt="Asset" 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">{order.id}</span>
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">• {order.date}</span>
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tight group-hover:text-primary transition-colors">
                              {typeof order.product === 'string' ? order.product : (product?.title?.en || "Premium Asset")}
                            </h3>
                            <div className="text-zinc-500 text-xs font-medium italic">
                              Professional Digital License Included
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
                          <div className="flex items-center gap-6 w-full sm:w-auto">
                            <div className="space-y-1 text-center sm:text-right flex-1 sm:flex-none">
                              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Amount Paid</div>
                              <div className="text-xl font-black text-white italic">₹{order.amount}</div>
                            </div>

                            <div className="space-y-1 text-center sm:text-right flex-1 sm:flex-none">
                              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</div>
                              <div className={`flex items-center gap-1.5 justify-center sm:justify-end text-[10px] font-black uppercase tracking-widest ${
                                isSuccess ? "text-green-500" : isFailed ? "text-red-500" : "text-amber-500"
                              }`}>
                                {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : isFailed ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                                {order.status}
                              </div>
                            </div>
                          </div>

                          <div className="w-full sm:w-auto">
                            {isSuccess ? (
                              <a 
                                href={product?.drive_link || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-primary px-8 py-4 rounded-xl transition-all group/btn w-full sm:w-auto"
                              >
                                <span className="text-xs font-black uppercase tracking-widest">Access Vault</span>
                                <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
                              </a>
                            ) : isFailed ? (
                              <Link href={`/product/${product?.id || order.product_id}`} className="w-full sm:w-auto block">
                                <button className="flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-8 py-4 rounded-xl transition-all w-full">
                                  <span className="text-xs font-black uppercase tracking-widest">Complete Payment</span>
                                  <Zap className="w-4 h-4" />
                                </button>
                              </Link>
                            ) : (
                              <div className="text-xs font-black text-zinc-600 uppercase tracking-widest italic border border-white/5 px-8 py-4 rounded-xl bg-white/[0.01]">
                                Verification Pending
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Background Accents */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-20 p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h4 className="text-lg font-black text-white uppercase italic tracking-tight">Enterprise Level Security</h4>
            <p className="text-zinc-500 text-sm font-medium italic">All assets are secured with end-to-end encryption. Your download links are private and exclusively for your authorized identity.</p>
          </div>
          <Link href="/contact" className="w-full md:w-auto">
            <button className="w-full md:w-auto bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 italic">
              Request Technical Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
