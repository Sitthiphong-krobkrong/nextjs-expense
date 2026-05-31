"use client";
import { useState, useEffect, useMemo } from "react";
import { loadFixedCosts } from "../services/fixedCostService";
import { loadBudgets } from "../services/budgetService";
import { getCategoryById, COLOR_CLASSES } from "../lib/categories";
import { useLang } from "../app/hooks/useLanguage";

function UpcomingSection({ lang, t }) {
  const [fixedCosts, setFixedCosts] = useState(() => loadFixedCosts());
  useEffect(() => {
    const sync = () => setFixedCosts(loadFixedCosts());
    window.addEventListener("transactions-updated", sync);
    return () => window.removeEventListener("transactions-updated", sync);
  }, []);
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();
  const currentMonthKey = `${todayY}-${String(todayM + 1).padStart(2, "0")}`;

  const upcoming = fixedCosts
    .filter((fc) => fc.isActive)
    .flatMap((fc) => {
      if (fc.frequency === "monthly") {
        const lastDay = new Date(todayY, todayM + 1, 0).getDate();
        const day = Math.min(fc.dayOfMonth, lastDay);
        const alreadyApplied = fc.lastApplied === currentMonthKey;
        if (alreadyApplied) return [];
        const daysLeft = day - todayD;
        if (daysLeft < 0) return []; // ผ่านไปแล้วในเดือนนี้
        return [{ ...fc, daysLeft, dueDate: `${todayY}-${String(todayM + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` }];
      }
      if (fc.frequency === "yearly") {
        if (fc.lastApplied === String(todayY)) return [];
        const start = new Date(fc.startDate);
        const dueMonth = start.getMonth();
        const dueDay = start.getDate();
        if (dueMonth < todayM || (dueMonth === todayM && dueDay < todayD)) return [];
        const daysLeft = Math.round((new Date(todayY, dueMonth, dueDay) - today) / 86400000);
        return [{ ...fc, daysLeft, dueDate: `${todayY}-${String(dueMonth + 1).padStart(2, "0")}-${String(dueDay).padStart(2, "0")}` }];
      }
      return [];
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  if (!upcoming.length) return null;

  return (
    <div className="glass-card rounded-3xl p-5 mb-6 shadow-xl shadow-sky-900/5">
      <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-violet-500"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        {lang === "th" ? "รายการที่กำลังจะถึง" : "Upcoming"}
      </h3>
      <div className="flex flex-col gap-2">
        {upcoming.map((fc) => (
          <div key={fc.id} className="flex items-center justify-between gap-3 py-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black text-white ${fc.type === "income" ? "bg-emerald-500" : "bg-red-500"}`}>
                {fc.type === "income" ? "+" : "−"}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{fc.description}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-sm font-black ${fc.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {fc.type === "income" ? "+" : "-"}{fc.amount.toLocaleString()}฿
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                fc.daysLeft === 0
                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                  : fc.daysLeft <= 3
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {fc.daysLeft === 0
                  ? (lang === "th" ? "วันนี้" : "Today")
                  : lang === "th" ? `อีก ${fc.daysLeft} วัน` : `${fc.daysLeft}d`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryBreakdown({ filteredTransactions, allTransactions, lang, t }) {
  const [budgets, setBudgets] = useState(() => loadBudgets());
  useEffect(() => {
    const sync = () => setBudgets(loadBudgets());
    window.addEventListener("transactions-updated", sync);
    return () => window.removeEventListener("transactions-updated", sync);
  }, []);

  // Previous month spending map
  const prevMonthMap = useMemo(() => {
    const now = new Date();
    let py = now.getFullYear(), pm = now.getMonth() - 1;
    if (pm < 0) { pm = 11; py--; }
    const prevKey = `${py}-${String(pm + 1).padStart(2, "0")}`;
    const map = {};
    (allTransactions || [])
      .filter((tx) => tx.type === "expense" && tx.date?.startsWith(prevKey))
      .forEach((tx) => { const id = tx.category || "other_expense"; map[id] = (map[id] || 0) + tx.amount; });
    return map;
  }, [allTransactions]);

  const breakdown = useMemo(() => {
    const map = {};
    filteredTransactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        const id = tx.category || "other_expense";
        map[id] = (map[id] || 0) + tx.amount;
      });
    const total = Object.values(map).reduce((s, v) => s + v, 0);
    if (!total) return [];
    return Object.entries(map)
      .map(([id, amount]) => ({ id, amount, pct: Math.round((amount / total) * 100) }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [filteredTransactions]);

  if (!breakdown.length) return null;

  return (
    <div className="glass-card rounded-3xl p-5 mb-6 shadow-xl shadow-sky-900/5">
      <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-sky-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        {lang === "th" ? "รายจ่ายตามหมวด" : "Expense by Category"}
      </h3>
      <div className="flex flex-col gap-3">
        {breakdown.map(({ id, amount, pct }) => {
          const cat = getCategoryById(id, "expense");
          const cc = COLOR_CLASSES[cat.color];
          const Icon = cat.Icon;
          const budget = budgets[id];
          const budgetPct = budget ? Math.round((amount / budget) * 100) : null;
          const prevAmt = prevMonthMap[id] || 0;
          const momDelta = prevAmt > 0 ? Math.round(((amount - prevAmt) / prevAmt) * 100) : null;
          const barColor = budgetPct === null ? cc.bg
            : budgetPct >= 100 ? "bg-rose-500"
            : budgetPct >= 75 ? "bg-amber-400"
            : cc.bg;

          return (
            <div key={id}>
              <div className="flex items-center justify-between mb-1">
                <div className={`flex items-center gap-1.5 text-xs font-bold ${cc.text}`}>
                  <Icon size={12} />
                  {t(cat.labelKey)}
                </div>
                <div className="flex items-center gap-2">
                  {momDelta !== null && (
                    <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${momDelta > 0 ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20" : "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"}`}>
                      {momDelta > 0 ? "+" : ""}{momDelta}%
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{Math.round(amount).toLocaleString()}฿</span>
                  {budget ? (
                    <span className={`text-[10px] font-bold ${budgetPct >= 100 ? "text-rose-500" : budgetPct >= 75 ? "text-amber-500" : "text-slate-400"}`}>
                      /{budget.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 w-7 text-right">{pct}%</span>
                  )}
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${budget ? Math.min(budgetPct, 100) : pct}%` }}
                />
              </div>
              {budget && budgetPct >= 80 && (
                <p className={`text-[10px] font-semibold mt-0.5 ${budgetPct >= 100 ? "text-rose-500" : "text-amber-500"}`}>
                  {budgetPct >= 100
                    ? (lang === "th" ? `เกินงบ ${(amount - budget).toLocaleString()} ฿` : `Over by ${(amount - budget).toLocaleString()}฿`)
                    : (lang === "th" ? `ใช้ไป ${budgetPct}% ของงบ` : `${budgetPct}% of budget used`)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FinancialInsights({ filteredTransactions, allTransactions }) {
  const { lang, t } = useLang();
  return (
    <>
      <UpcomingSection lang={lang} t={t} />
      <CategoryBreakdown filteredTransactions={filteredTransactions} allTransactions={allTransactions} lang={lang} t={t} />
    </>
  );
}
