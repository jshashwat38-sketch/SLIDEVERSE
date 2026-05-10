"use client";

import { useEffect, useState } from "react";
import { getAppearance } from "@/actions/adminActions";
import Link from "next/link";
import { Mail, Phone, ShieldCheck, FolderOpen, Zap } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import Image from "next/image";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export function GlobalFooter() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [appearance, setAppearance] = useState<any>(null);

  useEffect(() => {
    getAppearance().then(setAppearance);
  }, []);

  const handleFooterClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    if (link.startsWith('/#')) {
      const id = link.replace('/#', '');
      if (pathname !== '/') {
        // Navigate to home with hash
        window.location.href = link;
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: id === "story" ? "start" : "center" });
        }
      }
    } else {
      // Fallback navigation
      window.location.href = link;
    }
  };

  const policyLinks = [
    { label: "User Agreement", href: "/policies?tab=userAgreement" },
    { label: "Shipping Policy", href: "/policies?tab=shipping" },
    { label: "Refund Policy", href: "/policies?tab=refund" },
    { label: "Privacy Policy", href: "/policies?tab=privacy" },
    { label: "Terms of Service", href: "/policies?tab=terms" },
  ];

  return (
    <footer className={`border-t pt-28 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#09090B] border-white/5' : 'bg-white border-zinc-200'}`}>
      <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 aspect-square rounded-full overflow-hidden flex items-center justify-center shrink-0">
                <Image 
                  src="/footer-logo.jpg" 
                  alt="Logo" 
                  width={64} 
                  height={64} 
                  priority
                  className="w-full h-full object-cover" 
                />
              </div>
              <h2 className={`text-2xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                {appearance?.site?.name || "Slideverse"}
              </h2>
            </div>
            <p className={`text-sm font-medium leading-relaxed max-w-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}>
              Elevating digital storytelling through premium presentation architecture. Join the elite network of curators.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/slideversestudio?igsh=ODJkOTFhZm8wYzY3" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-500 hover:text-primary hover:border-primary/50' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-primary hover:border-primary'}`}>
                <InstagramIcon className="w-5 h-5" />
              </a>
              <Link href="/#featured" className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-500 hover:text-primary hover:border-primary/50' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-primary hover:border-primary'}`}>
                <FolderOpen className="w-5 h-5" />
              </Link>
              <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-zinc-500 hover:text-primary hover:border-primary/50' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-primary hover:border-primary'}`}>
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Policy Links */}
          <div className="space-y-6">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] italic ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Legal Framework</h3>
            <ul className="space-y-4">
              {policyLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    onClick={(e) => handleFooterClick(e, link.href)}
                    className={`hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}
                  >
                    <span className="w-0 h-px bg-primary transition-all group-hover:w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-6">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] italic ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Navigation</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", link: "/" },
                { name: "Categories", link: "/#featured" },
                { name: "Custom PPT", link: "/#custom-ppt" },
                { name: "About Us", link: "/#about" },
                { name: "Our Story", link: "/#story" },
                { name: "Contact Us", link: "/#contact" }
              ].map((item, i) => (
                <li key={i}>
                  <a
                  href={item.link}
                  onClick={(e) => handleFooterClick(e, item.link)}
                  className={`hover:text-primary text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-600'}`}
                >
                  <span className="w-0 h-px bg-primary transition-all group-hover:w-4" />
                  {item.name}
                </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] italic ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Communication</h3>
            <div className="space-y-4">
              <a href={`mailto:${appearance?.contact?.email || "support@slideverse.pro"}`} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Email Endpoint</p>
                  <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{appearance?.contact?.email || "support@slideverse.pro"}</p>
                </div>
              </a>
              <a href={`tel:${(appearance?.contact?.mobile || "+91 8602328776").replace(/[^0-9+]/g, '')}`} className="flex items-center gap-4 group touch-manipulation">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>Secure Line</p>
                  <p className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{appearance?.contact?.mobile || "+91 8602328776"}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Trust Area */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y mb-12 ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>
          {[
            { icon: ShieldCheck, title: "Secure Payments", subtitle: "100% Encrypted" },
            { icon: Zap, title: "Fast Delivery", subtitle: "Instant Activation" },
            { icon: Mail, title: "Expert Support", subtitle: "24/7 Assistance" },
            { icon: FolderOpen, title: "Premium Assets", subtitle: "Elite Templates" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-transparent transition-all ${theme === 'dark' ? 'bg-white/5 text-zinc-600 group-hover:text-primary group-hover:border-primary/20' : 'bg-zinc-50 text-zinc-400 group-hover:text-primary group-hover:border-primary'}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{stat.title}</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className={`pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] italic text-center md:text-left ${theme === 'dark' ? 'text-zinc-600' : 'text-zinc-400'}`}>
            © 2024 {appearance?.site?.name || "Slideverse"} Studio. All rights reserved. Built for the elite.
          </p>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Encrypted Session</span>
          </div>
        </div>

      </div>
    </footer>

  );
}
