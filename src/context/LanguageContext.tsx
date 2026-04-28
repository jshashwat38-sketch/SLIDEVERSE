"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/i18n/translations";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_language");
    if (savedLang) {
      setLanguageState(savedLang);
    } else if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const transCookie = cookies.find(c => c.trim().startsWith('googtrans='));
      if (transCookie) {
        const val = transCookie.split('=')[1];
        if (val.includes('/hi')) {
          setLanguageState('hi');
        }
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);

    if (typeof window !== 'undefined') {
      const transValue = `/en/${lang}`;
      
      // Clear old cookies to avoid conflicts
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
      
      // Assign translated states
      document.cookie = `googtrans=${transValue}; path=/;`;
      document.cookie = `googtrans=${transValue}; path=/; domain=` + window.location.hostname;
      
      // Refresh to deploy Google Translate instantly
      window.location.reload();
    }
  };

  const t = (key: string) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to English if translation is missing
    if (translations["en"] && translations["en"][key]) {
      return translations["en"][key];
    }
    return key; // Fallback to the key itself
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
