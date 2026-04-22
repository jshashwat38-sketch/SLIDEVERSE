"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Users, LogOut, Settings, Lock, Sparkles, MessageSquare } from "lucide-react";

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
    { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
    { href: "/admin/grievances", label: "Grievances", icon: MessageSquare },
  ];

  if (isChecking) return <div className="min-h-screen bg-background" />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
        
        <div className="bg-card p-12 rounded-[3rem] shadow-2xl w-full max-w-md border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 mx-auto border border-primary/20 shadow-[0_0_15px_rgba(212,255,0,0.1)]">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-black text-center text-white mb-2 uppercase tracking-tighter italic">Secure Access</h1>
          <p className="text-center text-zinc-500 mb-10 font-medium tracking-tight">System authentication required.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">System Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:bg-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all text-white placeholder:text-zinc-700 font-mono"
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm text-center font-bold uppercase tracking-wider animate-bounce">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-black py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_20px_rgba(212,255,0,0.3)] hover:shadow-[0_0_40px_rgba(212,255,0,0.5)] hover:-translate-y-1 uppercase tracking-widest"
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
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen border-r border-white/5 z-50">
        <div className="p-8 border-b border-white/5">
          <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-3 italic uppercase">
            <Settings className="w-6 h-6 text-primary neon-text" />
            Admin <span className="text-primary neon-text">Ops</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
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
        <div className="p-6 border-t border-white/5 bg-black/20">
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
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(212,255,0,0.02),transparent)]">
        <div className="max-w-7xl mx-auto p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
