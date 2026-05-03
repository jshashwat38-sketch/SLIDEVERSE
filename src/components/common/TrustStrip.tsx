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
      className="flex flex-col items-center justify-center p-5 sm:p-6 md:p-8 bg-white dark:bg-[#0c0c0c] md:bg-transparent md:dark:bg-transparent rounded-2xl md:rounded-none border border-zinc-100 dark:border-white/5 md:border-none shadow-sm md:shadow-none group text-center"
    >
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(197,165,114,0.1)] mb-4 md:mb-0 md:mr-4">
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="md:text-left">
        <div className="text-xl md:text-3xl font-black text-zinc-900 dark:text-white italic tracking-tighter leading-none">
          <Counter value={value} />
        </div>
        <div className="text-[8px] md:text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-2 leading-none whitespace-nowrap">
          {label}
        </div>
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
    <section className="py-8 md:py-16 relative overflow-hidden">
      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Wrapper: Compact Ivory Block */}
        <div className="md:hidden bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-4 shadow-xl relative overflow-hidden">
           {/* Ambient Glow for Mobile */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-[60px] pointer-events-none" />
           
           <div className="grid grid-cols-2 gap-3 relative z-10">
              {stats.map((stat, i) => (
                <StatItem key={i} {...stat} delay={i * 0.1} />
              ))}
           </div>
        </div>

        {/* Desktop Version: Horizontal Strip */}
        <div className="hidden md:flex items-center justify-between py-12 px-8 border-y border-zinc-200 dark:border-white/5 bg-white/[0.02] dark:bg-white/[0.01] backdrop-blur-sm rounded-[3rem]">
          <div className="grid grid-cols-4 gap-12 w-full divide-x divide-zinc-200 dark:divide-white/5">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-center first:pl-0 pl-12">
                 <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex items-center gap-5 group"
                 >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-zinc-900 dark:text-white italic tracking-tighter">
                        <Counter value={stat.value} />
                      </div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">
                        {stat.label}
                      </div>
                    </div>
                 </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
