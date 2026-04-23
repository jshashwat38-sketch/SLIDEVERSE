"use client";

import { useEffect, useState } from "react";
import { getAppearance } from "@/actions/adminActions";
import Link from "next/link";
import { Mail, Phone, ShieldCheck, Globe, FolderOpen } from "lucide-react";



import Image from "next/image";

export function GlobalFooter() {

  const [appearance, setAppearance] = useState<any>(null);

  useEffect(() => {
    getAppearance().then(setAppearance);
  }, []);

  const policyLinks = [
    { label: "User Agreement", href: "/policies?tab=userAgreement" },
    { label: "Shipping Policy", href: "/policies?tab=shipping" },
    { label: "Refund Policy", href: "/policies?tab=refund" },
    { label: "Privacy Policy", href: "/policies?tab=privacy" },
    { label: "Terms of Service", href: "/policies?tab=terms" },
  ];

  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image 
                src={appearance?.site?.logo || "/logo.png"} 
                alt="Logo" 
                width={48} 
                height={48} 
                priority
                className="w-12 h-12 object-contain" 
              />
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                {appearance?.site?.name || "Slideverse"}
              </h2>
            </div>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
              Elevating digital storytelling through premium presentation architecture. Join the elite network of curators.
            </p>
            <div className="flex gap-4">
              <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 transition-all">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="/#featured" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 transition-all">
                <FolderOpen className="w-5 h-5" />
              </Link>
              <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary hover:border-primary/50 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Policy Links */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Legal Framework</h3>
            <ul className="space-y-4">
              {policyLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-zinc-500 hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-primary transition-all group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Navigation</h3>
            <ul className="space-y-4">
              {["Home", "Categories", "About Us", "Our Story", "Contact Us"].map((item, i) => (
                <li key={i}>
                  <Link href={`/#${item.toLowerCase().replace(" ", "")}`} className="text-zinc-500 hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-primary transition-all group-hover:w-4" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Communication</h3>
            <div className="space-y-4">
              <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Email Endpoint</p>
                  <p className="text-xs font-bold text-white">{appearance?.contact?.email || "support@slideverse.pro"}</p>
                </div>
              </a>
              <a href={`tel:${(appearance?.contact?.mobile || "+91 99999 99999").replace(/\s/g, '')}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Secure Line</p>
                  <p className="text-xs font-bold text-white">{appearance?.contact?.mobile || "+91 99999 99999"}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic text-center md:text-left">
            © 2024 {appearance?.site?.name || "Slideverse"} Studio. All rights reserved. Built for the elite.
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Encrypted Session</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
