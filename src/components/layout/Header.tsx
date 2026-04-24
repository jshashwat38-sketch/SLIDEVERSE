"use client";

import Link from "next/link";
import { Search, ShoppingCart, User as UserIcon, LogOut, Menu, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { totalItems } = useCart();
  const { user, logout, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-black/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between transition-all">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Logo - Always visible when sidebar is closed */}
        <Link href="/" className="lg:hidden flex items-center gap-3 shrink-0 group">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden shrink-0">
            {/* Spinning gradient border */}
            <div className="absolute inset-0 w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_120deg,#C5A572_180deg,transparent_240deg)] animate-spin duration-[4000ms] opacity-80 transform-gpu origin-center" />
            
            {/* Inner background to mask the center */}
            <div className="absolute inset-[2px] bg-[#09090b] rounded-full z-10" />
            
            {/* Outer static border */}
            <div className="absolute inset-0 rounded-full border border-white/5 z-10" />
            
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(197,165,114,0.3)] opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10" />

            {/* Logo */}
            <img 
              src="/logo.png" 
              alt="Slideverse Logo" 
              className="w-full h-full object-contain relative z-20 mix-blend-screen scale-[1.35] group-hover:scale-[1.45] transition-transform duration-500" 
            />
          </div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase italic truncate max-w-[120px] group-hover:text-primary transition-colors duration-500">Slideverse</h1>
        </Link>

        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-zinc-500 hover:text-white bg-white/5 rounded-xl border border-white/10"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative w-full max-w-md group hidden sm:block">
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

      <nav className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/#about" className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors">{t("about_us")}</Link>
          <Link href="/#story" className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors">{t("our_story")}</Link>
          <Link href="/#contact" className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors">{t("contact_us")}</Link>
        </div>
        
        <div className="hidden lg:block h-6 w-px bg-white/10 mx-2"></div>
        
        <Link href="/cart" className="relative text-zinc-400 hover:text-primary transition-colors flex items-center gap-2 group">
          <ShoppingCart className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(197,165,114,0.5)]" />
          <span className="text-sm font-medium hidden md:block">{t("cart")}</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(197,165,114,0.5)]">
              {totalItems}
            </span>
          )}
        </Link>

        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center gap-4 relative">
            <Link href="/account" className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors group">
              <ShoppingBag className="w-4 h-4 group-hover:drop-shadow-[0_0_8px_rgba(197,165,114,0.5)]" />
              <span className="text-xs font-black uppercase tracking-widest italic">My Vault</span>
            </Link>
            <span className="text-xs sm:text-sm font-medium text-zinc-200 hidden min-[450px]:inline">Hi, {user.name}</span>
            <button 
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              className={`p-2 rounded-xl transition-all ${showLogoutConfirm ? 'bg-red-500 text-white' : 'text-zinc-500 hover:text-red-500 hover:bg-white/5'}`}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {showLogoutConfirm && (
              <div className="absolute top-full right-0 mt-4 p-6 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl z-50 min-w-[200px] animate-in slide-in-from-top-2 duration-300">
                <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4 italic text-center">Terminate Session?</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      logout();
                      setShowLogoutConfirm(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Confirm Logout
                  </button>
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="w-full bg-white/5 hover:bg-white/10 text-zinc-400 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/signin"
            className="flex items-center gap-2 bg-primary text-black px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium hover:bg-primary-hover shadow-[0_0_15px_rgba(197,165,114,0.3)] transition-all hover:shadow-[0_0_25px_rgba(197,165,114,0.5)] hover:-translate-y-0.5"
          >
            <UserIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{t("sign_in")}</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
