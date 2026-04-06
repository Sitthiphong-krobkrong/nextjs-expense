import { useState } from "react";
import { useLang } from "../app/hooks/useLanguage";

export default function TransactionList({ items, onEdit, onDelete }) {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const { t, lang } = useLang();
  const locale = lang === "th" ? "th-TH" : "en-GB";
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const sortedItems = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pagedItems = sortedItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="glass-card border border-white/60 rounded-3xl overflow-hidden mb-8 shadow-xl shadow-cyan-900/5 relative">
      {/* Soft background glow for the card itself */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Header */}
      <div className="px-5 py-4 border-b flex justify-between items-center relative z-10 border-cyan-50/50 dark:border-slate-700/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/70 dark:bg-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-cyan-700 dark:text-sky-400" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sky-900 dark:text-slate-200">{t("list_title")}</h2>
            <p className="text-xs text-cyan-700 dark:text-slate-400">{items.length} รายการ</p>
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
          {/* Mobile card view (Fintech Apple Wallet inspired) */}
          <div className="block md:hidden p-3 space-y-4">
            {pagedItems.map((tx) => (
              <div key={tx.id} className="group relative">
                {/* Background ambient glow effect */}
                <div className={`absolute inset-0 blur-2xl rounded-full opacity-0 transition-opacity duration-500 ${tx.type === "expense" ? "bg-rose-500/20 group-hover:opacity-100 dark:bg-rose-500/30" : "bg-emerald-500/20 group-hover:opacity-100 dark:bg-emerald-500/30"}`}></div>
                
                {/* Card */}
                <div className="relative overflow-hidden rounded-[24px] p-4 flex items-center gap-4 bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white dark:border-white/[0.05] transition-all duration-300 transform active:scale-[0.98]">
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden ${tx.type === "expense" ? "bg-rose-100/60 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400" : "bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"}`}>
                    <div className={`absolute inset-0 opacity-10 dark:opacity-20 ${tx.type === "expense" ? "bg-gradient-to-br from-rose-400 to-rose-600" : "bg-gradient-to-br from-emerald-400 to-emerald-600"}`}></div>
                    {tx.type === "expense" ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative z-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-[15px] font-extrabold tracking-wide truncate text-slate-800 dark:text-white mb-1.5">{tx.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider ${tx.type === "expense" ? "bg-rose-100/80 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400" : "bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"}`}>
                        {tx.type === "expense" ? t("list_expense_badge") : t("list_income_badge")}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {tx.date ? new Date(tx.date).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "2-digit" }) : "-"}
                      </span>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex flex-col items-end justify-between h-[3.5rem] shrink-0">
                    <span className={`font-black text-[17px] tracking-tight drop-shadow-sm ${tx.type === "expense" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {tx.type === "expense" ? "-" : "+"}{tx.amount.toLocaleString()}
                      <span className="text-[11px] ml-1 opacity-60">฿</span>
                    </span>
                    
                    <div className="flex gap-1.5 mt-auto">
                      <button 
                        onClick={() => onEdit(tx)} 
                        aria-label="แก้ไข" 
                        className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button 
                        onClick={() => onDelete(tx.id)} 
                        aria-label="ลบ" 
                        className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto px-4 pb-4">
            <table className="w-full border-separate border-spacing-y-3 mt-2">
              <thead>
                <tr>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-center w-24 text-slate-400">{t("list_manage")}</th>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-right text-slate-400">{t("list_amount")}</th>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-left text-slate-400">{t("list_detail")}</th>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-center text-slate-400">{t("list_type")}</th>
                  <th className="px-5 py-3 text-[11px] font-black uppercase tracking-widest text-center text-slate-400">{t("list_date")}</th>
                </tr>
              </thead>
              <tbody>
                {pagedItems.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    className="group bg-white/70 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-800/80 transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
                  >
                    <td className="px-5 py-3.5 first:rounded-l-3xl last:rounded-r-3xl border-y border-l border-white/60 dark:border-white/[0.05] transition-colors">
                      <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(tx)}
                          aria-label="แก้ไข"
                          className="p-2.5 rounded-full hover:scale-110 transition-all bg-slate-100 dark:bg-slate-800/80 text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:shadow-md"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(tx.id)}
                          aria-label="ลบ"
                          className="p-2.5 rounded-full hover:scale-110 transition-all bg-slate-100 dark:bg-slate-800/80 text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:shadow-md"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right border-y border-white/60 dark:border-white/[0.05] transition-colors">
                      <span className={`font-black text-xl tracking-tight drop-shadow-sm transition-colors ${tx.type === "expense" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {tx.type === "expense" ? "-" : "+"}{tx.amount.toLocaleString()}
                        <span className="text-xs ml-1 opacity-60">฿</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 border-y border-white/60 dark:border-white/[0.05] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 shrink-0 rounded-[14px] flex items-center justify-center relative overflow-hidden ${tx.type === "expense" ? "bg-rose-100/60 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400" : "bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-500 dark:text-emerald-400"}`}>
                          <div className={`absolute inset-0 opacity-10 dark:opacity-20 ${tx.type === "expense" ? "bg-gradient-to-br from-rose-400 to-rose-600" : "bg-gradient-to-br from-emerald-400 to-emerald-600"}`}></div>
                          {tx.type === "expense" ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="relative z-10"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                          ) : (
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="relative z-10"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                          )}
                        </div>
                        <span className="font-extrabold text-[15px] tracking-wide text-slate-800 dark:text-white">{tx.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center border-y border-white/60 dark:border-white/[0.05] transition-colors">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wider ${tx.type === "expense" ? "bg-rose-100/80 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400" : "bg-emerald-100/80 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"}`}>
                        {tx.type === "expense" ? t("list_expense_badge") : t("list_income_badge")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center first:rounded-l-3xl last:rounded-r-3xl border-y border-r border-white/60 dark:border-white/[0.05] transition-colors">
                      <span className="text-[13px] font-bold text-slate-400 dark:text-slate-500">
                        {tx.date ? new Date(tx.date).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-5 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-gray-100 dark:border-slate-700/50">
          <p className="text-xs w-full sm:w-auto text-center sm:text-left text-gray-500 dark:text-slate-400">
            {t("list_page")} {currentPage} {t("list_of")} {totalPages}
          </p>
          <div className="flex gap-1 sm:gap-1.5 flex-wrap sm:flex-nowrap justify-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40 flex items-center justify-center min-w-[32px] sm:min-w-[auto] bg-sky-50 dark:bg-sky-900/20 text-sky-900 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50"
            >
              <span className="hidden sm:inline">{t("list_prev")}</span>
              <span className="sm:hidden">←</span>
            </button>

            {(() => {
              let start = Math.max(1, currentPage - 1);
              let end = Math.min(totalPages, start + 2);
              if (end - start < 2 && start > 1) {
                start = Math.max(1, end - 2);
              }
              return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium min-w-[32px] sm:min-w-[auto] border ${
                    currentPage === i
                      ? "bg-cyan-700 dark:bg-cyan-500/60 text-white border-transparent shadow-[0_2px_8px_rgba(14,116,144,0.35)]"
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
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40 flex items-center justify-center min-w-[32px] sm:min-w-[auto] bg-sky-50 dark:bg-sky-900/20 text-sky-900 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50"
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
