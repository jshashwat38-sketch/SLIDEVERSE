"use client";

import Link from "next/link";
import { Search, ShoppingCart, User as UserIcon, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function Header() {
  const { totalItems } = useCart();
  const { user, logout, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-black/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 px-8 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-6 flex-1">
        <form onSubmit={handleSearch} className="relative w-full max-w-md group">
          <input
            type="text"
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 text-sm transition-all text-white placeholder:text-zinc-500"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
        </form>
      </div>

      <nav className="flex items-center gap-6">
        <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors">{t("about_us")}</Link>
        <Link href="/story" className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors">{t("our_story")}</Link>
        <Link href="/contact" className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors">{t("contact_us")}</Link>
        
        <div className="h-6 w-px bg-white/10 mx-2"></div>
        
        <Link href="/cart" className="relative text-zinc-400 hover:text-primary transition-colors flex items-center gap-2 group">
          <ShoppingCart className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(212,255,0,0.5)]" />
          <span className="text-sm font-medium">{t("cart")}</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(212,255,0,0.5)]">
              {totalItems}
            </span>
          )}
        </Link>

        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-200">Hi, {user.name}</span>
            <button 
              onClick={logout}
              className="text-zinc-500 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link 
            href="/signin"
            className="flex items-center gap-2 bg-primary text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover shadow-[0_0_15px_rgba(212,255,0,0.3)] transition-all hover:shadow-[0_0_25px_rgba(212,255,0,0.5)] hover:-translate-y-0.5"
          >
            <UserIcon className="w-4 h-4" />
            {t("sign_in")}
          </Link>
        )}
      </nav>
    </header>
  );
}
