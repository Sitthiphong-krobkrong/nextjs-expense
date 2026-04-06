"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { translations, Lang, TranslationKey } from "../../lib/i18n";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

// @ts-ignore
export const LangContext = createContext<LangContextType>(null);

export function useLang() {
  return useContext(LangContext);
}

export function useLangState() {
  const [lang, setLangState] = useState<Lang>("th");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang;
      if (saved === "th" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
  };

  // ไม่ใช้ useCallback เพื่อให้ t() อ่าน lang ล่าสุดเสมอ
  const t = (key: TranslationKey): string => translations[lang][key] ?? key;

  return { lang, setLang, t };
}
