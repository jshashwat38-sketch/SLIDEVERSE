"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, LogOut, Settings, Lock, Sparkles, MessageSquare, Menu, X, Phone, Gift, BarChart3, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

import PasswordInput from "@/components/common/PasswordInput";
import LogoLoader from "@/components/common/LogoLoader";



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();


  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "slideverse@build") {
      localStorage.setItem("adminAuth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect access key");
    }
  };

  const links = [
    { href: "/admin", label: "Orders", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products CMS", icon: Package },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Settings },
    { href: "/admin/appearance", label: "Appearance", icon: Sparkles },
    { href: "/admin/contact", label: "Contact Settings", icon: Phone },
    { href: "/admin/security", label: "Security", icon: Lock },
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },

    { href: "/admin/grievances", label: "Grievances", icon: MessageSquare },
    { href: "/admin/coupons", label: "Coupons", icon: Gift },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];


  if (isChecking) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LogoLoader />
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        
        <div className="bg-card p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-primary/20 shadow-[0_0_15px_rgba(197,165,114,0.1)]">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-black text-center text-white mb-2 uppercase tracking-tighter italic">Secure Access</h1>
          <p className="text-center text-zinc-500 mb-10 font-medium tracking-tight">System authentication required.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <PasswordInput
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="System Password"
              placeholder="••••••••"
            />


            
            {error && (
              <p className="text-red-500 text-sm text-center font-bold uppercase tracking-wider animate-bounce">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-black py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_20px_rgba(197,165,114,0.3)] hover:shadow-[0_0_40px_rgba(197,165,114,0.5)] hover:-translate-y-1 uppercase tracking-widest"
            >
              Authorize
            </button>
            
            <Link href="/" className="block text-center text-sm font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest mt-6">
              Cancel & Exit
            </Link>
          </form>
          
          <div className="mt-10 pt-6 border-t border-white/5 text-center text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-bold">
            Slideverse Terminal v2.0
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-sidebar border-b border-white/5 p-4 z-[60] flex items-center justify-between">
        <h1 className="text-lg font-black tracking-tighter text-white flex items-center gap-2 italic uppercase">
          <Settings className="w-5 h-5 text-primary" />
          Admin <span className="text-primary">Ops</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${theme === 'dark' ? 'text-primary bg-white/5 border-white/10' : 'text-black bg-zinc-100 border-zinc-200'}`}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Sun className="w-5 h-5 text-[#000000]" /> : <Moon className="w-5 h-5 text-[#C5A572]" />}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-white/5 rounded-lg text-white"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:relative top-0 left-0 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-white/5 z-[60] transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-8 border-b border-white/5 hidden lg:block">
          <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-3 italic uppercase">
            <Settings className="w-6 h-6 text-primary neon-text" />
            Admin <span className="text-primary neon-text">Ops</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-20 lg:mt-8 overflow-y-auto custom-scrollbar">

          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
                  isActive 
                    ? "bg-primary/10 text-primary font-black shadow-[0_0_15px_rgba(197,165,114,0.15)] border border-primary/20" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                <span className="uppercase tracking-widest text-xs font-black">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col gap-4">
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all cursor-pointer ${theme === 'dark' ? 'bg-white/5 text-zinc-300 hover:text-white' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'}`}
          >
            {theme === "light" ? <Sun className="w-4 h-4 text-[#000000]" /> : <Moon className="w-4 h-4 text-[#C5A572]" />}
            <span className="uppercase tracking-widest text-xs font-black">{theme === "light" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("adminAuth");
              setIsAuthenticated(false);
            }}
            className="w-full flex items-center gap-4 px-6 py-4 text-xs font-black text-zinc-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all uppercase tracking-[0.2em]"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(197,165,114,0.02),transparent)] mt-16 lg:mt-0">
        <div className="max-w-7xl mx-auto p-6 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );

}
