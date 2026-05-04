import { useState, Fragment } from "react";
import { useLang } from "../app/hooks/useLanguage";

function groupByDate(items) {
  const map = new Map();
  for (const tx of items) {
    const key = tx.date ? tx.date.substring(0, 10) : "unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(tx);
  }
  return Array.from(map, ([dateKey, items]) => ({ dateKey, items }));
}

function DateHeader({ dateKey, items, locale, lang }) {
  const dayIncome = items.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const dayExpense = items.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const dateLabel =
    dateKey === "unknown"
      ? "—"
      : new Date(dateKey).toLocaleDateString(locale, {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "2-digit",
        });

  return (
    <div className="flex items-center gap-3 px-1 py-2 mt-2 first:mt-0">
      <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 whitespace-nowrap">
        {dateLabel}
      </span>
      <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700/60" />
      <div className="flex items-center gap-2 shrink-0">
        {dayIncome > 0 && (
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            +{dayIncome.toLocaleString()}
          </span>
        )}
        {dayExpense > 0 && (
          <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400">
            -{dayExpense.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default function TransactionList({ items, onEdit, onDelete }) {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { t, lang } = useLang();
  const locale = lang === "th" ? "th-TH" : "en-GB";

  const sortedItems = [...items].sort((a, b) => {
    // เรียงตามวันที่ล่าสุดก่อน ถ้าวันเดียวกันเรียงตาม id ล่าสุด
    const dateA = a.date ? a.date.substring(0, 10) : "";
    const dateB = b.date ? b.date.substring(0, 10) : "";
    if (dateB !== dateA) return dateB > dateA ? 1 : -1;
    return b.id - a.id;
  });
  const totalPages = Math.ceil(sortedItems.length / PAGE_SIZE);
  const pagedItems = sortedItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const groups = groupByDate(pagedItems);

  return (
    <div className="glass-card border border-white/60 rounded-3xl overflow-hidden mb-8 shadow-xl shadow-emerald-900/5 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="px-5 py-4 border-b flex justify-between items-center relative z-10 border-emerald-50/50 dark:border-slate-700/50 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/70 dark:bg-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-700 dark:text-emerald-400" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-emerald-900 dark:text-slate-200">{t("list_title")}</h2>
            <p className="text-xs text-emerald-700 dark:text-slate-400">{items.length} {lang === "th" ? "รายการ" : "transactions"}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {pagedItems.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-gray-400 dark:text-slate-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-gray-300 dark:text-slate-600">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
          <p className="text-sm">{t("list_empty")}</p>
          <p className="text-xs mt-1">{t("list_empty_sub")}</p>
        </div>
      ) : (
        <>
          {/* Mobile — grouped card view */}
          <div className="block md:hidden px-3 pb-4">
            {groups.map(({ dateKey, items: dayItems }) => (
              <div key={dateKey}>
                <DateHeader dateKey={dateKey} items={dayItems} locale={locale} lang={lang} />
                <div className="space-y-2">
                  {dayItems.map((tx) => (
                    <div key={tx.id} className="group relative">
                      <div className={`absolute inset-0 blur-2xl rounded-full opacity-0 transition-opacity duration-500 ${tx.type === "expense" ? "bg-rose-500/20 group-hover:opacity-100 dark:bg-rose-500/30" : "bg-emerald-500/20 group-hover:opacity-100 dark:bg-emerald-500/30"}`} />
                      <div className="relative overflow-hidden rounded-[20px] px-4 py-3 flex items-center gap-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl shadow-sm hover:shadow-md border border-white dark:border-white/[0.05] transition-all duration-200">

                        {/* Icon */}
                        <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center relative overflow-hidden ${tx.type === "expense" ? "bg-rose-100/60 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400" : "bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"}`}>
                          <div className={`absolute inset-0 opacity-10 dark:opacity-20 ${tx.type === "expense" ? "bg-gradient-to-br from-rose-400 to-rose-600" : "bg-gradient-to-br from-emerald-400 to-emerald-600"}`} />
                          {tx.type === "expense" ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-extrabold truncate text-slate-800 dark:text-white">{tx.description}</p>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded-md ${tx.type === "expense" ? "bg-rose-100/80 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400" : "bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"}`}>
                              {tx.type === "expense" ? t("list_expense_badge") : t("list_income_badge")}
                            </span>
                            {tx.isFixed && (
                              <span className="text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                {tx.type === "expense" ? t("list_fixed_expense_badge") : t("list_fixed_income_badge")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Amount & Actions */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`font-black text-[16px] tracking-tight ${tx.type === "expense" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                            {tx.type === "expense" ? "-" : "+"}{tx.amount.toLocaleString()}
                            <span className="text-[10px] ml-0.5 opacity-60">฿</span>
                          </span>
                          <div className="flex gap-1.5">
                            <button onClick={() => onEdit(tx)} aria-label="แก้ไข" className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => onDelete(tx.id)} aria-label="ลบ" className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop — grouped table view */}
          <div className="hidden md:block overflow-x-auto px-4 pb-4">
            <table className="w-full border-separate border-spacing-y-2 mt-2">
              <thead>
                <tr>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-center w-24 text-slate-400">{t("list_manage")}</th>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-right text-slate-400">{t("list_amount")}</th>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-left text-slate-400">{t("list_detail")}</th>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-center text-slate-400">{t("list_type")}</th>
                </tr>
              </thead>
              <tbody>
                {groups.map(({ dateKey, items: dayItems }) => {
                  const dayIncome = dayItems.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
                  const dayExpense = dayItems.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
                  const dateLabel =
                    dateKey === "unknown"
                      ? "—"
                      : new Date(dateKey).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "2-digit" });

                  return (
                    <Fragment key={dateKey}>
                      {/* Date group header row */}
                      <tr>
                        <td colSpan={4} className="pt-4 pb-1 px-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 whitespace-nowrap">{dateLabel}</span>
                            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-700/60" />
                            <div className="flex items-center gap-3">
                              {dayIncome > 0 && <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+{dayIncome.toLocaleString()} ฿</span>}
                              {dayExpense > 0 && <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400">-{dayExpense.toLocaleString()} ฿</span>}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Rows for this day */}
                      {dayItems.map((tx) => (
                        <tr key={tx.id} className="group bg-white/70 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-800/80 transition-all duration-200 shadow-sm hover:shadow-lg dark:shadow-none">
                          <td className="px-5 py-3 first:rounded-l-2xl last:rounded-r-2xl border-y border-l border-white/60 dark:border-white/[0.05]">
                            <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => onEdit(tx)} aria-label="แก้ไข" className="p-2 rounded-full hover:scale-110 transition-all bg-slate-100 dark:bg-slate-800/80 text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:shadow-md">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button onClick={() => onDelete(tx.id)} aria-label="ลบ" className="p-2 rounded-full hover:scale-110 transition-all bg-slate-100 dark:bg-slate-800/80 text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:shadow-md">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right border-y border-white/60 dark:border-white/[0.05]">
                            <span className={`font-black text-xl tracking-tight ${tx.type === "expense" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                              {tx.type === "expense" ? "-" : "+"}{tx.amount.toLocaleString()}
                              <span className="text-xs ml-1 opacity-60">฿</span>
                            </span>
                          </td>
                          <td className="px-5 py-3 border-y border-white/60 dark:border-white/[0.05]">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center relative overflow-hidden ${tx.type === "expense" ? "bg-rose-100/60 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400" : "bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400"}`}>
                                <div className={`absolute inset-0 opacity-10 ${tx.type === "expense" ? "bg-gradient-to-br from-rose-400 to-rose-600" : "bg-gradient-to-br from-emerald-400 to-emerald-600"}`} />
                                {tx.type === "expense" ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="relative z-10"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="relative z-10"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                )}
                              </div>
                              <span className="font-extrabold text-[15px] text-slate-800 dark:text-white">{tx.description}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-center first:rounded-l-2xl last:rounded-r-2xl border-y border-r border-white/60 dark:border-white/[0.05]">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wider ${tx.type === "expense" ? "bg-rose-100/80 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400" : "bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"}`}>
                                {tx.type === "expense" ? t("list_expense_badge") : t("list_income_badge")}
                              </span>
                              {tx.isFixed && (
                                <span className="px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wider bg-amber-100/80 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                  {tx.type === "expense" ? t("list_fixed_expense_badge") : t("list_fixed_income_badge")}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-5 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 border-gray-100 dark:border-slate-700/50">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {t("list_page")} {currentPage} {t("list_of")} {totalPages}
          </p>
          <div className="flex gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
            >
              <span className="hidden sm:inline">{t("list_prev")}</span>
              <span className="sm:hidden">←</span>
            </button>
            {(() => {
              let start = Math.max(1, currentPage - 1);
              let end = Math.min(totalPages, start + 2);
              if (end - start < 2 && start > 1) start = Math.max(1, end - 2);
              return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    currentPage === i
                      ? "bg-emerald-700 dark:bg-emerald-500/60 text-white border-transparent shadow-[0_2px_8px_rgba(14,116,144,0.35)]"
                      : "bg-gray-100 dark:bg-slate-800/50 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-white/10"
                  }`}
                >
                  {i}
                </button>
              ));
            })()}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
            >
              <span className="hidden sm:inline">{t("list_next")}</span>
              <span className="sm:hidden">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
