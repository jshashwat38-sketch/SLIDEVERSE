"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider, useTheme } from "./ThemeContext";
import LogoLoader from "@/components/common/LogoLoader";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <PreloaderWrapper>{children}</PreloaderWrapper>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#0a0a0a',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                  fontFamily: 'inherit',
                  fontSize: '0.8rem',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function PreloaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {isPageLoading ? (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl animate-in fade-in duration-300 ${theme === 'dark' ? 'bg-[#000000]/95' : 'bg-[#FCFBF8]/95'}`}>
          <LogoLoader />
        </div>
      ) : null}
      <div className={isPageLoading ? "hidden" : "animate-in fade-in duration-500"}>
        {children}
      </div>
    </>
  );
}
