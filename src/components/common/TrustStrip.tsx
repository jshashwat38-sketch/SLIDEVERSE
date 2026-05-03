"use client";

import { motion } from "framer-motion";
import { Download, Users, Star, Gift, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

interface StatItemProps {
  icon: any;
  value: string;
  label: string;
  delay?: number;
}

function Counter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const safeValue = String(value || "0");
  
  // Handle decimal values like "4.9/5"
  const isDecimal = safeValue.includes(".");
  const parts = safeValue.split("/");
  const mainPart = parts[0];
  const fractionPart = parts.slice(1).join("/");
  
  const numericValue = isDecimal 
    ? parseFloat(mainPart.replace(/[^0-9.]/g, "")) || 0 
    : parseInt(mainPart.replace(/[^0-9]/g, "")) || 0;
    
  const mainSuffix = mainPart.replace(/[0-9.]/g, "");
  const finalSuffix = mainSuffix + (fractionPart ? "/" + fractionPart : "");

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (start === end) {
      setCount(end);
      return;
    }

    let totalDuration = 2000;
    let stepTime = 16;
    let steps = totalDuration / stepTime;
    let increment = end / steps;
    
    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericValue]);

  return (
    <span>
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {finalSuffix}
    </span>
  );
}

function StatItem({ icon: Icon, value, label, delay = 0 }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col md:flex-row items-center gap-4 px-8 py-6 group"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(197,165,114,0.1)]">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-center md:text-left">
        <div className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white italic tracking-tighter">
          <Counter value={value} />
        </div>
        <div className="text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.3em] mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

export default function TrustStrip({ data }: { data?: any }) {
  const stats = [
    { icon: Download, value: data?.downloads || "1200+", label: "Premium Downloads" },
    { icon: Users, value: data?.users || "500+", label: "Happy Strategists" },
    { icon: Star, value: data?.rating || "4.9/5", label: "Executive Rating" },
    { icon: Gift, value: data?.customOrders || "100+", label: "Custom Deployments" }
  ];

  return (
    <section className="py-12 border-y border-zinc-200 dark:border-white/5 bg-white/[0.02] dark:bg-white/[0.01] backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-white/5">
          {stats.map((stat, i) => (
            <div key={i} className="pt-8 md:pt-0 first:pt-0">
               <StatItem {...stat} delay={i * 0.1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
