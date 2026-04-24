"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, FolderOpen, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { getCategories } from "@/actions/adminActions";
import { useLanguage } from "@/context/LanguageContext";

import Image from "next/image";
import { X } from "lucide-react";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
    // Check for admin authentication
    const auth = typeof window !== 'undefined' ? localStorage.getItem("adminAuth") : null;
    if (auth === "true") {
      setIsAdmin(true);
    }
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文 (Mandarin)" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "ar", name: "العربية (Arabic)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "ru", name: "Русский (Russian)" },
    { code: "pt", name: "Português" },
    { code: "de", name: "Deutsch" },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-white/5 z-50">

      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden shrink-0">
            {/* Spinning gradient border */}
            <div 
              className="absolute inset-0 w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,#C5A572_180deg,transparent_240deg)] opacity-80" 
              style={{ animation: 'ring-rotate 4s linear infinite' }}
            />
            
            {/* Inner background to mask the center */}
            <div className="absolute inset-[2px] bg-[#09090b] rounded-full z-10" />
            
            {/* Outer static border */}
            <div className="absolute inset-0 rounded-full border border-white/5 z-10" />
            
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(197,165,114,0.3)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Logo */}
            <Image 
              src="/logo.png" 
              alt="Slideverse Logo" 
              width={64} 
              height={64} 
              priority
              className="w-full h-full object-contain relative z-20 mix-blend-screen scale-[1.35] group-hover:scale-[1.45] transition-transform duration-500" 
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase italic group-hover:text-primary transition-colors duration-500">Slideverse</h1>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-zinc-500 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">

        <Link
          key="my-vault"
          href="/account"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === "/account" 
              ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(197, 165, 114, 0.2)] border border-primary/20" 
              : "text-zinc-500 hover:text-white hover:bg-white/5"
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          My Vault
        </Link>

        <Link
          href="/"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            pathname === "/" 
              ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(197, 165, 114, 0.2)] border border-primary/20" 
              : "text-zinc-500 hover:text-white hover:bg-white/5"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {t("home")}
        </Link>
        
        <div>
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">{t("categories")}</span>
            </div>
            {isCategoriesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isCategoriesOpen && (
            <div className="mt-2 ml-4 pl-4 border-l border-zinc-800 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
              {categories.map((cat) => (

                <Link
                  key={cat.id}
                  href={`/category/${cat.id.replace('cat-', '')}`}
                  onClick={onClose}
                  className="block px-4 py-2 text-sm text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors break-words"
                  title={typeof cat.title === 'object' && cat.title !== null ? ((cat.title as any)[language] || (cat.title as any).en || "") : (cat.title || "")}
                >
                  {typeof cat.title === 'object' && cat.title !== null ? ((cat.title as any)[language] || (cat.title as any).en || "") : (cat.title || "")}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-white/5">
          <Link
            href="/#about"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === "/about" 
                ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(197, 165, 114, 0.2)] border border-primary/20" 
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            {t("about_us")}
          </Link>

          <Link
            href="/#story"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === "/story" 
                ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(197, 165, 114, 0.2)] border border-primary/20" 
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            {t("our_story")}
          </Link>

          <Link
            href="/#contact"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === "/contact" 
                ? "bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(197, 165, 114, 0.2)] border border-primary/20" 
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            {t("contact_us")}
          </Link>
        </div>

        <div className="pt-4 mt-4 border-t border-white/5 pb-4">
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-medium">{t("change_language")}</span>
            </div>
            {isLanguageOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isLanguageOpen && (
            <div className="mt-2 ml-4 pl-4 border-l border-zinc-800 space-y-1 max-h-48 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLanguageOpen(false);
                  }}
                  className={`w-full text-left block px-4 py-2 text-sm rounded-lg transition-colors truncate ${
                    language === lang.code 
                      ? "bg-primary/20 text-primary font-bold" 
                      : "text-zinc-500 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
