"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { GlobalFooter } from "@/components/layout/GlobalFooter";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      // Force immediate scroll reset bypassing smooth behavior
      mainRef.current.style.scrollBehavior = 'auto';
      mainRef.current.scrollTop = 0;
      
      // Use a small timeout to ensure it sticks after Next.js finishes rendering
      const timeoutId = setTimeout(() => {
        if (mainRef.current) {
          mainRef.current.scrollTop = 0;
          mainRef.current.style.scrollBehavior = 'smooth';
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-[70] h-full
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto scroll-smooth bg-[#09090B] custom-scrollbar"
        >

          <div className="w-[94%] max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1680px] mx-auto px-6 py-8 md:py-12">
            {children}
          </div>
          <GlobalFooter />

        </main>
      </div>
    </div>

  );
}

