"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "career-studio-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "en" || stored === "ar") {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  // Persist to localStorage on change
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  const isRTL = lang === "ar";

  // Always provide context, but use default values until mounted
  // This prevents the "must be used within provider" error during SSR
  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Helper hook for getting localized field values
export function useLocalizedField<T extends Record<string, unknown>>(
  obj: T | null | undefined,
  fieldBase: string
): string {
  const { lang } = useLanguage();
  if (!obj) return "";

  const localizedKey = `${fieldBase}_${lang}` as keyof T;
  const fallbackKey = `${fieldBase}_en` as keyof T;

  const value = obj[localizedKey] ?? obj[fallbackKey] ?? "";
  return String(value);
}
