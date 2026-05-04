"use client";
import { useMemo, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLang } from "../app/hooks/useLanguage";

const DAY_LABELS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let week = new Array(firstDay).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

export default function ExpenseCalendar({ transactions }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  const { t, lang } = useLang();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState("daily");
  const [expandedWeek, setExpandedWeek] = useState(null);

  // Build daily map
  const dailyMap = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      if (!tx.date) return;
      const d = new Date(tx.date);
      if (d.getFullYear() !== viewYear || d.getMonth() !== viewMonth) return;
      const day = d.getDate();
      if (!map[day]) map[day] = { income: 0, expense: 0, items: [] };
      if (tx.type === "income") map[day].income += tx.amount;
      else map[day].expense += tx.amount;
      map[day].items.push(tx);
    });
    return map;
  }, [transactions, viewYear, viewMonth]);

  const weeks = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  const weeklySummary = useMemo(() => {
    return weeks.map((week) => {
      let income = 0, expense = 0, count = 0;
      week.forEach((day) => {
        if (day && dailyMap[day]) {
          income += dailyMap[day].income;
          expense += dailyMap[day].expense;
          count += dailyMap[day].items.length;
        }
      });
      return { income, expense, count };
    });
  }, [weeks, dailyMap]);

  const monthTotal = useMemo(() => {
    let income = 0, expense = 0;
    Object.values(dailyMap).forEach((d) => {
      income += d.income;
      expense += d.expense;
    });
    return { income, expense };
  }, [dailyMap]);

  const maxDailyExpense = useMemo(() => {
    let max = 0;
    Object.values(dailyMap).forEach((d) => {
      if (d.expense > max) max = d.expense;
    });
    return max || 1;
  }, [dailyMap]);

  const navigateMonth = (delta) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
    setSelectedDay(null);
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  const locale = lang === "th" ? "th-TH" : "en-GB";

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const isToday = (day) =>
    day && viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();

  const getHeatBg = (day) => {
    if (!day || !dailyMap[day] || dailyMap[day].expense === 0) return "";
    const ratio = dailyMap[day].expense / maxDailyExpense;
    if (isDark) {
      if (ratio < 0.25) return "bg-rose-950/25";
      if (ratio < 0.5) return "bg-rose-900/35";
      if (ratio < 0.75) return "bg-rose-900/50";
      return "bg-rose-900/60";
    }
    if (ratio < 0.25) return "bg-rose-50";
    if (ratio < 0.5) return "bg-rose-100/80";
    if (ratio < 0.75) return "bg-rose-200/80";
    return "bg-rose-300/70";
  };

  const selectedDayData = selectedDay && dailyMap[selectedDay] ? dailyMap[selectedDay] : null;

  const shortAmount = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 10000) return `${(n / 1000).toFixed(0)}K`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toLocaleString();
  };

  return (
    <div className="glass-card rounded-3xl shadow-xl shadow-emerald-900/5 mb-8 overflow-hidden relative transition-colors duration-300">
      {/* Background glows */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── Header ── */}
      <div className="px-5 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-indigo-50/60 dark:border-slate-700/50 bg-gradient-to-br from-violet-50/50 to-green-50/50 dark:from-emerald-900/15 dark:to-emerald-900/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-600 dark:text-emerald-400" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{t("cal_title")}</h2>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400/70">{t("cal_subtitle")}</p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex rounded-xl overflow-hidden border border-emerald-200/60 dark:border-slate-600/50 shadow-sm self-end sm:self-auto">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-4 py-2 text-xs font-extrabold tracking-wide transition-all ${viewMode === "daily"
                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                : "bg-white/50 dark:bg-slate-800/50 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700/50"
              }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{t("cal_daily")}
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-4 py-2 text-xs font-extrabold tracking-wide transition-all ${viewMode === "weekly"
                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                : "bg-white/50 dark:bg-slate-800/50 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700/50"
              }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>{t("cal_weekly")}
          </button>
        </div>
      </div>

      {/* ── Month navigation ── */}
      <div className="px-5 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigateMonth(-1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-emerald-600 dark:text-emerald-400"
          aria-label="เดือนก่อน"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-wide">{monthLabel}</span>
          <button
            onClick={goToToday}
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 transition-colors border border-emerald-200/50 dark:border-emerald-700/30"
          >
            {t("cal_today")}
          </button>
        </div>

        <button
          onClick={() => navigateMonth(1)}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-emerald-600 dark:text-emerald-400"
          aria-label="เดือนถัดไป"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ── Monthly summary ── */}
      <div className="px-5 sm:px-6 pb-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl py-3 px-4 bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30">
          <p className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 mb-1 flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7 7 7-7"/></svg>{t("cal_income_month")}
          </p>
          <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">+{monthTotal.income.toLocaleString()} <span className="text-sm">฿</span></p>
        </div>
        <div className="rounded-2xl py-3 px-4 bg-rose-50/80 dark:bg-rose-900/20 border border-rose-200/50 dark:border-rose-700/30">
          <p className="text-[11px] font-bold text-rose-500 dark:text-rose-400 mb-1 flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>{t("cal_expense_month")}
          </p>
          <p className="text-lg font-extrabold text-rose-700 dark:text-rose-300">-{monthTotal.expense.toLocaleString()} <span className="text-sm">฿</span></p>
        </div>
      </div>

      {/* ══════════ DAILY VIEW ══════════ */}
      {viewMode === "daily" ? (
        <div className="px-3 sm:px-4 pb-5">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2 px-1">
            {DAY_LABELS.map((label, i) => (
              <div
                key={label}
                className={`text-center py-2 text-xs font-extrabold tracking-wider ${i === 0 ? "text-rose-400" : i === 6 ? "text-emerald-400" : "text-slate-400 dark:text-slate-500"
                  }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Weeks grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="mb-1">
              <div className="grid grid-cols-7 gap-[3px]">
                {week.map((day, di) => {
                  const data = day ? dailyMap[day] : null;
                  const isSelected = selectedDay === day && day !== null;
                  const todayMark = isToday(day);
                  const heat = getHeatBg(day);
                  const hasData = data && (data.expense > 0 || data.income > 0);

                  return (
                    <button
                      key={di}
                      disabled={!day}
                      onClick={() => day && setSelectedDay(day === selectedDay ? null : day)}
                      className={`
                        relative rounded-xl sm:rounded-2xl flex flex-col items-center justify-start
                        min-h-[48px] sm:min-h-[80px] p-1 sm:p-1.5
                        transition-all duration-200
                        ${!day ? "pointer-events-none opacity-0" : "cursor-pointer active:scale-[0.95] sm:hover:scale-[1.03]"}
                        ${isSelected
                          ? "ring-2 ring-emerald-500 dark:ring-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 shadow-md sm:shadow-lg shadow-emerald-500/15"
                          : heat
                            ? `${heat} sm:hover:shadow-md`
                            : "bg-white/40 dark:bg-slate-800/20 sm:hover:bg-gray-50 dark:sm:hover:bg-slate-800/40 sm:hover:shadow-sm"
                        }
                        ${todayMark && !isSelected ? "ring-2 ring-emerald-400 dark:ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20" : ""}
                      `}
                    >
                      {day && (
                        <>
                          {/* Day number */}
                          <span
                            className={`text-[13px] sm:text-sm font-bold leading-none ${todayMark
                                ? "bg-emerald-500 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-[13px] shadow-sm shadow-emerald-500/30"
                                : di === 0
                                  ? "text-rose-500 dark:text-rose-400"
                                  : di === 6
                                    ? "text-emerald-500 dark:text-emerald-400"
                                    : "text-slate-700 dark:text-slate-300"
                              }`}
                          >
                            {day}
                          </span>

                          {/* Mobile: colored dots only */}
                          {hasData && (
                            <div className="flex gap-1 mt-auto mb-0.5 sm:hidden">
                              {data.expense > 0 && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                              {data.income > 0 && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                            </div>
                          )}

                          {/* Desktop: amount pills */}
                          {hasData && (
                            <div className="hidden sm:flex mt-auto w-full flex-col gap-0.5 px-0.5">
                              {data.expense > 0 && (
                                <div className="bg-rose-500/10 dark:bg-rose-500/15 rounded-md py-0.5 px-1">
                                  <p className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 text-center leading-tight truncate">
                                    -{shortAmount(data.expense)}
                                  </p>
                                </div>
                              )}
                              {data.income > 0 && (
                                <div className="bg-emerald-500/10 dark:bg-emerald-500/15 rounded-md py-0.5 px-1">
                                  <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 text-center leading-tight truncate">
                                    +{shortAmount(data.income)}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Tx count badge — desktop only */}
                          {hasData && (
                            <div className="hidden sm:block absolute top-1 right-1">
                              <span className="flex items-center justify-center w-4 h-4 text-[8px] font-black rounded-full bg-emerald-500 text-white shadow-sm">
                                {data.items.length}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          ))}

          {/* Heat map legend — desktop */}
          <div className="hidden sm:flex items-center justify-center gap-2 pt-3 mt-2 border-t border-gray-100/50 dark:border-slate-700/30">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{t("cal_heat_low")}</span>
            <div className="flex gap-1.5">
              <span className={`w-4 h-4 rounded-md border ${isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200"}`} />
              <span className={`w-4 h-4 rounded-md ${isDark ? "bg-rose-950/25" : "bg-rose-50"}`} />
              <span className={`w-4 h-4 rounded-md ${isDark ? "bg-rose-900/35" : "bg-rose-100/80"}`} />
              <span className={`w-4 h-4 rounded-md ${isDark ? "bg-rose-900/50" : "bg-rose-200/80"}`} />
              <span className={`w-4 h-4 rounded-md ${isDark ? "bg-rose-900/60" : "bg-rose-300/70"}`} />
            </div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{t("cal_heat_high")}</span>
          </div>

          {/* Mobile: simple dot legend + hint */}
          <div className="flex sm:hidden flex-col items-center gap-2 pt-3 mt-2 border-t border-gray-100/50 dark:border-slate-700/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{t("dash_expense_label")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{t("dash_income_label")}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{t("cal_tap_hint")}</p>
          </div>
        </div>
      ) : (
        /* ══════════ WEEKLY VIEW ══════════ */
        <div className="px-4 sm:px-5 pb-5 space-y-3">
          {weeks.map((week, wi) => {
            const summary = weeklySummary[wi];
            const hasTx = summary.income > 0 || summary.expense > 0;
            const net = summary.income - summary.expense;
            const daysLabel = week.filter(Boolean);
            const startDay = daysLabel[0];
            const endDay = daysLabel[daysLabel.length - 1];
            const monthShort = new Date(viewYear, viewMonth).toLocaleDateString(locale, { month: "short" });
            const isExpanded = expandedWeek === wi;
            const weekItems = week
              .filter(Boolean)
              .flatMap((day) => (dailyMap[day] ? dailyMap[day].items.map((tx) => ({ ...tx, day })) : []))
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            return (
              <div
                key={wi}
                className={`rounded-2xl overflow-hidden transition-all duration-200 border ${hasTx
                    ? "bg-white/70 dark:bg-slate-800/40 border-emerald-200/40 dark:border-slate-700/40 shadow-sm"
                    : "bg-gray-50/30 dark:bg-slate-900/20 border-gray-100/50 dark:border-slate-800/30 opacity-50"
                  }`}
              >
                {/* Week header — clickable */}
                <button
                  onClick={() => hasTx && setExpandedWeek(isExpanded ? null : wi)}
                  disabled={!hasTx}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors ${hasTx
                      ? "bg-emerald-50/50 dark:bg-violet-900/15 hover:bg-violet-100/50 dark:hover:bg-violet-900/25 cursor-pointer"
                      : "cursor-default"
                    } border-b border-emerald-100/50 dark:border-slate-700/30`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-xl">
                      {t("cal_week")} {wi + 1}
                    </span>
                    <div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {startDay} — {endDay} {monthShort}
                      </span>
                      {hasTx && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">
                          ({summary.count} {t("cal_items")})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {hasTx && (
                      <span className={`text-base font-extrabold ${net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {net >= 0 ? "+" : ""}{net.toLocaleString()} ฿
                      </span>
                    )}
                    {hasTx && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`text-emerald-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Summary bars */}
                {hasTx && (
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7 7 7-7"/></svg>{t("dash_income_label")}
                        </span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">+{summary.income.toLocaleString()} ฿</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-100 dark:bg-slate-700/50 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 ease-out"
                          style={{ width: `${Math.max(monthTotal.income > 0 ? (summary.income / monthTotal.income) * 100 : 0, 2)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>{t("dash_expense_label")}
                        </span>
                        <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">-{summary.expense.toLocaleString()} ฿</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-100 dark:bg-slate-700/50 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-700 ease-out"
                          style={{ width: `${Math.max(monthTotal.expense > 0 ? (summary.expense / monthTotal.expense) * 100 : 0, 2)}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Expanded transaction list */}
                {isExpanded && hasTx && (
                  <div className="border-t border-emerald-100/50 dark:border-slate-700/30 px-4 py-3 space-y-2 max-h-72 overflow-y-auto">
                    {weekItems.map((tx) => (
                      <div key={tx.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/30 shadow-sm">
                        <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${tx.type === "expense" ? "bg-rose-100 dark:bg-rose-900/40 text-rose-500" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500"}`}>
                          {tx.type === "expense" ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7 7 7-7"/></svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{tx.description}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {new Date(tx.date).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })}
                            </p>
                            {tx.isFixed && (
                              <span className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                                {tx.type === "expense" ? t("list_fixed_expense_badge") : t("list_fixed_income_badge")}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-sm font-extrabold shrink-0 ${tx.type === "expense" ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {tx.type === "expense" ? "-" : "+"}{tx.amount.toLocaleString()} ฿
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {!hasTx && (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-600">{t("cal_no_items")}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════ Selected day detail ══════════ */}
      {selectedDay && selectedDayData && viewMode === "daily" && (
        <div className="border-t-2 border-emerald-200/60 dark:border-slate-700/40 px-5 sm:px-6 py-5 bg-gradient-to-br from-emerald-50/40 to-white/60 dark:from-slate-900/40 dark:to-slate-900/60">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString(locale, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-slate-400 dark:text-slate-500"
              aria-label="ปิด"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Day summary badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedDayData.income > 0 && (
              <span className="text-sm font-extrabold px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/30 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7 7 7-7"/></svg>+{selectedDayData.income.toLocaleString()} ฿
              </span>
            )}
            {selectedDayData.expense > 0 && (
              <span className="text-sm font-extrabold px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-700/30 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>-{selectedDayData.expense.toLocaleString()} ฿
              </span>
            )}
            <span className="text-sm font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              {selectedDayData.items.length} {t("cal_items")}
            </span>
          </div>

          {/* Transactions list */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {selectedDayData.items
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/30 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${tx.type === "expense"
                        ? "bg-rose-100 dark:bg-rose-900/40 text-rose-500 dark:text-rose-400"
                        : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 dark:text-emerald-400"
                      }`}
                  >
                    {tx.type === "expense" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{tx.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(tx.date).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.
                      </p>
                      {tx.isFixed && (
                        <span className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100/80 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                          {tx.type === "expense" ? t("list_fixed_expense_badge") : t("list_fixed_income_badge")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-base font-extrabold shrink-0 ${tx.type === "expense"
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-emerald-600 dark:text-emerald-400"
                      }`}
                  >
                    {tx.type === "expense" ? "-" : "+"}{tx.amount.toLocaleString()} ฿
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
