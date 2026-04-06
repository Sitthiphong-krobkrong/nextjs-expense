"use client";
import { LangContext, useLangState } from "../app/hooks/useLanguage";

export default function LangProvider({ children }: { children: React.ReactNode }) {
  const langState = useLangState();
  return <LangContext.Provider value={langState}>{children}</LangContext.Provider>;
}
