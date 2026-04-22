"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { LanguageProvider } from "./LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
