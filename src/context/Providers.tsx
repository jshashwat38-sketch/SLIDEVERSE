"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            {children}
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
