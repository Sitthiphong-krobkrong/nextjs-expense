"use client";
import { useState } from "react";
import { loadTransactions } from "../../services/transactionService";
import ExpenseCalendar from "../../components/ExpenseCalendar";
import { useLang } from "../hooks/useLanguage";

export default function CalendarPage() {
  const [transactions] = useState(() => loadTransactions());
  const { t } = useLang();

  return (
    <div className="min-h-screen py-6 px-4 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 pt-4 relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow-sm border transition-colors bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-600 border-emerald-100/50 dark:bg-slate-800/80 dark:text-emerald-400 dark:border-slate-700/50 dark:from-slate-800/80 dark:to-slate-800/80">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight text-gradient-primary dark:text-gradient-primary">
            {t("calendar_title")}
          </h1>
          <p className="font-medium text-gray-500 dark:text-slate-400">{t("calendar_subtitle")}</p>
        </div>
        <ExpenseCalendar transactions={transactions} />
      </div>
    </div>
  );
}
