"use client";

import { useState, useEffect } from "react";
import { getAppearance } from "@/actions/adminActions";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, RotateCcw, Lock, FileText, ChevronRight } from "lucide-react";


import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type PolicyKey = "userAgreement" | "shipping" | "refund" | "privacy" | "terms";

function PoliciesContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as PolicyKey) || "userAgreement";
  const [activeTab, setActiveTab] = useState<PolicyKey>(initialTab);
  const [policies, setPolicies] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPolicies() {
      const data = await getAppearance();
      setPolicies(data?.policies);
      setLoading(false);
    }
    loadPolicies();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab") as PolicyKey;
    if (tab && ["userAgreement", "shipping", "refund", "privacy", "terms"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);


  const tabs = [
    { id: "userAgreement", label: "User Agreement", icon: FileText },
    { id: "shipping", label: "Shipping Policy", icon: Truck },
    { id: "refund", label: "Refund Policy", icon: RotateCcw },
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "terms", label: "Terms of Service", icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse delay-700" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6 border border-primary/20"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Legal Framework</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-6"
          >
            Policies & <span className="text-primary">Agreements</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-2xl mx-auto text-sm font-medium uppercase tracking-[0.3em] italic"
          >
            Transparency is the foundation of our partnership. Explore our governing principles.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Tab Navigation */}
          <div className="lg:col-span-4 space-y-3">
            {tabs.map((tab, idx) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setActiveTab(tab.id as PolicyKey)}
                className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all duration-500 group relative overflow-hidden ${
                  activeTab === tab.id 
                  ? "bg-primary text-black border-primary shadow-[0_0_40px_rgba(212,255,0,0.2)]" 
                  : "bg-white/5 text-zinc-500 border-white/5 hover:border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-black" : "text-primary"}`} />
                  <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${activeTab === tab.id ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`} />
                
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-card/40 backdrop-blur-3xl p-10 md:p-16 rounded-[3rem] border border-white/5 min-h-[500px]"
              >
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_20px_rgba(212,255,0,0.1)]">
                    {(() => {
                      const Icon = tabs.find(t => t.id === activeTab)?.icon || FileText;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">Version 1.0.0 (Latest)</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-zinc-400 leading-relaxed text-sm font-medium whitespace-pre-wrap">
                    {policies?.[activeTab] || "Policy details loading..."}
                  </p>
                </div>

                <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">
                    Copyright © 2024 Slideverse. All rights reserved.
                  </p>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
                      Print Page
                    </button>
                    <button className="px-6 py-3 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,255,0,0.2)]">
                      Download PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PoliciesContent />
    </Suspense>
  );
}

