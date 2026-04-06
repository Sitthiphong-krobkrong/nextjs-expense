"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
    const saved = localStorage.getItem("lang") as Lang;
    if (saved === "th" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key] ?? key,
    [lang]
  );

  return { lang, setLang, t };
}
