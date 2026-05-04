"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLang } from "../hooks/useLanguage";

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  const { t } = useLang();
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 relative z-10 pt-4">
          <div className={`inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl mb-4 shadow-sm border transition-colors ${isDark ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
             </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{
            background: isDark ? "linear-gradient(135deg, #34d399, #6ee7b7)" : "linear-gradient(135deg, #059669, #065f46)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {t("about_title")}
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            {t("about_subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="glass-card p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-teal-600'}`}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
               </svg>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{t("about_f1_title")}</h3>
            <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {t("about_f1_desc")}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'}`}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
               </svg>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{t("about_f2_title")}</h3>
            <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {t("about_f2_desc")}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600'}`}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
               </svg>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{t("about_f3_title")}</h3>
            <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              {t("about_f3_desc")}
            </p>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-slate-700/30 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-700/20 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-3">{t("about_contact_title")}</h2>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              {t("about_contact_sub")}
            </p>
            <a 
              href="mailto:sitthiphong.krobkrong@gmail.com" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              {t("about_contact_btn")}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
