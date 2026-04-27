"use client";

import Link from "next/link";
import { Search, ShoppingCart, User as UserIcon, LogOut, Menu, ShoppingBag, MoreVertical, Sun, Moon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { totalItems } = useCart();
  const { user, logout, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileLogoClicked, setIsMobileLogoClicked] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (pathname !== "/") {
      window.location.href = `/#${id}`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        if (id === "story") {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`border-b sticky top-0 z-40 px-4 md:px-8 py-3 sm:py-4 transition-all flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${theme === 'dark' ? 'bg-[#000000] border-white/5' : 'bg-white border-zinc-200'}`}>
      <div className="flex items-center justify-between w-full sm:w-auto sm:flex-1 sm:gap-3">
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={onMenuClick}
            className={`p-2 rounded-xl border shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${theme === 'dark' ? 'text-zinc-300 bg-white/5 border-white/10 hover:text-primary' : 'text-[#4A2BBD] bg-zinc-50 border-zinc-200 hover:bg-zinc-100'}`}
            title="Access Options"
          >
            <Menu className="w-5 h-5 lg:hidden" />
            <MoreVertical className="w-5 h-5 hidden lg:block" />
          </button>

          {/* Mobile Logo - Always visible when sidebar is closed */}
          <div 
            onClick={() => {
              setIsMobileLogoClicked(true);
              setTimeout(() => {
                window.location.reload();
              }, 400);
            }} 
            className="flex items-center gap-2 shrink-0 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full overflow-hidden shrink-0">
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
              <img 
                src="/logo.png" 
                alt="Slideverse Logo" 
                className="w-full h-full object-contain relative z-20 mix-blend-screen scale-[1.35] group-hover:scale-[1.45] transition-transform duration-500" 
              />
            </div>
            <h1 
              className={`text-sm sm:text-base font-black uppercase transition-all duration-300 group-hover:text-primary group-hover:scale-105 ${isMobileLogoClicked ? 'text-primary' : 'text-white'}`}
              style={{
                fontStyle: 'italic',
                transform: 'skewX(-8deg)',
                paddingRight: '6px',
                overflow: 'visible',
                maxWidth: '100%'
              }}
            >
              Slideverse
            </h1>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all hidden sm:flex items-center justify-center text-primary active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(197,165,114,0.1)] relative z-50 ml-1"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-[#5D3FD3]" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-[#C5A572]" />
            )}
          </button>
        </div>



        {/* Mobile Nav Icons (sm:hidden) */}
        <div className="flex items-center gap-4 sm:hidden">
          {/* Mobile Theme Toggle Button placed to the left of the cart */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-zinc-400 hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5 text-[#5D3FD3]" />
            ) : (
              <Moon className="w-5 h-5 text-[#C5A572]" />
            )}
          </button>

          <Link href="/cart" className="relative text-zinc-400 hover:text-primary transition-colors flex items-center group">
            <ShoppingCart className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(197,165,114,0.5)]" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(197,165,114,0.5)]">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <Link href="/account" className="relative text-zinc-400 hover:text-primary transition-colors group">
              <ShoppingBag className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(197,165,114,0.5)]" />
            </Link>
          ) : (
            <Link href="/signin" className="relative text-zinc-400 hover:text-primary transition-colors group">
              <UserIcon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(197,165,114,0.5)]" />
            </Link>
          )}
        </div>
      </div>



      <nav className="hidden sm:flex items-center gap-4 md:gap-6 justify-end">

        <div className="hidden lg:flex items-center gap-6">
          <a href="#about" onClick={(e) => handleScroll(e, "about")} className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors cursor-pointer">{t("about_us")}</a>
          <a href="#story" onClick={(e) => handleScroll(e, "story")} className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors cursor-pointer">{t("our_story")}</a>
          <a href="#contact" onClick={(e) => handleScroll(e, "contact")} className="text-sm font-medium text-zinc-400 hover:text-primary transition-colors cursor-pointer">{t("contact_us")}</a>
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
