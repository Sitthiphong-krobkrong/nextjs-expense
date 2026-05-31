"use client";
import { useState } from "react";
import { getCategoriesForType, COLOR_CLASSES } from "../lib/categories";
import { loadBudgets, setBudget } from "../services/budgetService";
import { useLang } from "../app/hooks/useLanguage";

export default function BudgetManager() {
  const { t, lang } = useLang();
  const [budgets, setBudgets] = useState(() => loadBudgets());
  const [editing, setEditing] = useState(null); // categoryId being edited
  const [inputVal, setInputVal] = useState("");

  const expenseCategories = getCategoriesForType("expense");

  const handleSave = (catId) => {
    const updated = setBudget(catId, parseFloat(inputVal) || 0);
    setBudgets(updated);
    setEditing(null);
    setInputVal("");
  };

  const handleClear = (catId) => {
    const updated = setBudget(catId, 0);
    setBudgets(updated);
  };

  return (
    <div className="glass-card rounded-3xl p-5 shadow-xl shadow-sky-900/5">
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-violet-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
          {lang === "th" ? "งบประมาณต่อเดือน" : "Monthly Budget"}
        </h3>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
        {lang === "th" ? "ตั้งวงเงินต่อหมวดหมู่ — แจ้งเตือนเมื่อใกล้เกิน" : "Set spending limits per category"}
      </p>

      <div className="flex flex-col gap-2">
        {expenseCategories.map((cat) => {
          const cc = COLOR_CLASSES[cat.color];
          const Icon = cat.Icon;
          const budget = budgets[cat.id];
          const isEditing = editing === cat.id;

          return (
            <div key={cat.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center ${cc.bg} ${cc.text}`}>
                <Icon size={14} />
              </div>
              <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-300 min-w-0 truncate">
                {t(cat.labelKey)}
              </span>

              {isEditing ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number" min="0" autoFocus
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSave(cat.id); if (e.key === "Escape") { setEditing(null); setInputVal(""); } }}
                    placeholder="0"
                    className="w-24 px-2.5 py-1.5 text-sm rounded-lg border border-violet-300 dark:border-violet-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                  />
                  <button onClick={() => handleSave(cat.id)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-violet-500 text-white hover:bg-violet-600">
                    {lang === "th" ? "บันทึก" : "Save"}
                  </button>
                  <button onClick={() => { setEditing(null); setInputVal(""); }} className="px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">✕</button>
                </div>
              ) : budget ? (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{budget.toLocaleString()} ฿</span>
                  <button onClick={() => { setEditing(cat.id); setInputVal(String(budget)); }} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-violet-500 transition-colors">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => handleClear(cat.id)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditing(cat.id); setInputVal(""); }}
                  className="text-xs font-semibold text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors shrink-0"
                >
                  {lang === "th" ? "+ ตั้งวงเงิน" : "+ Set limit"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
