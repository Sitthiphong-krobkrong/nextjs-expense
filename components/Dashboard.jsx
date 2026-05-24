import { useMemo, useState, useEffect } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { useTheme } from "next-themes";
import { useLang } from "../app/hooks/useLanguage";

Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Plugin วาด center text
const centerTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    const { ctx, chartArea } = chart;
    if (!chartArea) return;
    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data.length) return;

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    const label = chart.options.plugins.centerText?.label ?? "";
    const value = chart.options.plugins.centerText?.value ?? "";
    const color = chart.options.plugins.centerText?.color ?? "#334155";
    const subColor = chart.options.plugins.centerText?.subColor ?? "#94a3b8";

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 13px Kanit, sans-serif";
    ctx.fillStyle = subColor;
    ctx.fillText(label, centerX, centerY - 14);

    ctx.font = "bold 20px Kanit, sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(value, centerX, centerY + 10);

    ctx.restore();
  },
};

Chart.register(centerTextPlugin);

export default function Dashboard({ transactions, filteredTransactions, viewMode, onViewModeChange }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";
  const { t, lang } = useLang();

  const scopedTransactions = filteredTransactions ?? transactions;

  const income = scopedTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = scopedTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const hasData = income > 0 || expense > 0;

  // Monthly bar data — last 6 months
  const monthlyData = useMemo(() => {
    const map = {};
    transactions.forEach((tx) => {
      if (!tx.date) return;
      const key = tx.date.substring(0, 7); // "YYYY-MM"
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      if (tx.type === "income") map[key].income += tx.amount;
      else map[key].expense += tx.amount;
    });
    const sorted = Object.keys(map).sort().slice(-6);
    return {
      labels: sorted.map((k) => {
        const [y, m] = k.split("-");
        return new Date(y, parseInt(m) - 1).toLocaleDateString(lang === "th" ? "th-TH" : "en-GB", { month: "short", year: "2-digit" });
      }),
      income: sorted.map((k) => map[k].income),
      expense: sorted.map((k) => map[k].expense),
      hasData: sorted.length > 0,
    };
  }, [transactions]);

  const pieData = useMemo(() => ({
    labels: [t("dash_income_label"), t("dash_expense_label"), t("dash_balance_label")],
    datasets: [{
      data: hasData ? [income, expense, Math.max(balance, 0)] : [1, 1, 1],
      backgroundColor: hasData
        ? ["#34d399", "#f87171", "#60a5fa"]
        : [isDark ? "#1e293b" : "#f1f5f9", isDark ? "#1e293b" : "#f1f5f9", isDark ? "#1e293b" : "#f1f5f9"],
      hoverBackgroundColor: ["#10b981", "#ef4444", "#3b82f6"],
      borderWidth: hasData ? 3 : 0,
      borderColor: isDark ? "#0f172a" : "#ffffff",
      hoverOffset: 6,
    }],
  }), [income, expense, balance, isDark, hasData]);

  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const statCards = [
    {
      label: t("dash_income"),
      value: income,
      show: showIncome,
      toggle: () => setShowIncome((p) => !p),
      containerClass: "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 shadow-emerald-500/20 border-emerald-500/30",
      textColor: "text-emerald-800 dark:text-emerald-300",
      accentColor: "#10b981",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-600 dark:text-emerald-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7 7 7-7" />
        </svg>
      ),
    },
    {
      label: t("dash_expense"),
      value: expense,
      show: showExpense,
      toggle: () => setShowExpense((p) => !p),
      containerClass: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 shadow-red-500/20 border-red-500/30",
      textColor: "text-red-800 dark:text-red-300",
      accentColor: "#ef4444",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-600 dark:text-red-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7-7 7 7" />
        </svg>
      ),
    },
    {
      label: t("dash_balance"),
      value: balance,
      show: showBalance,
      toggle: () => setShowBalance((p) => !p),
      containerClass: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-blue-500/20 border-blue-500/30",
      textColor: "text-blue-900 dark:text-blue-300",
      accentColor: "#3b82f6",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-600 dark:text-blue-400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ];

  const centerColor = isDark ? "#e2e8f0" : "#1e293b";
  const centerSub = isDark ? "#64748b" : "#94a3b8";
  const balanceLabel = balance >= 0 ? "ยอดคงเหลือ" : "ขาดทุน";
  const balanceDisplay = `${balance >= 0 ? "+" : ""}${balance.toLocaleString()} ฿`;

  return (
    <>
      {/* View Mode Toggle */}
      {onViewModeChange && (
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-1 shadow-md border border-slate-200/50 dark:border-slate-700/50">
            {[
              { key: "all", label: t("dash_view_all") },
              { key: "month", label: t("dash_view_month") },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onViewModeChange(key)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  viewMode === key
                    ? "bg-sky-500 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Doughnut Chart Card */}
      <div className="glass-card mb-6 rounded-3xl shadow-xl shadow-sky-900/5 p-6 sm:p-8 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-400/8 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col items-center gap-4">
          {/* Chart */}
          <div className="relative w-[200px] h-[200px]">
            <Doughnut
              key={`doughnut-${resolvedTheme}`}
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                cutout: "68%",
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    enabled: hasData,
                    backgroundColor: isDark ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.88)",
                    titleFont: { family: "Kanit, sans-serif", size: 13, weight: "bold" },
                    bodyFont: { family: "Kanit, sans-serif", size: 13 },
                    titleColor: "#f1f5f9",
                    bodyColor: "#e2e8f0",
                    padding: 12,
                    cornerRadius: 10,
                    callbacks: {
                      label: (ctx) => `  ${ctx.raw.toLocaleString()} ฿`,
                    },
                  },
                  centerText: {
                    label: hasData ? t("dash_summary") : t("dash_no_data"),
                    value: "",
                    color: centerSub,
                    subColor: centerSub,
                  },
                },
                animation: { animateRotate: true, duration: 900, easing: "easeInOutQuart" },
              }}
            />
          </div>

          {/* Legend — horizontal */}
          <div className="flex items-center justify-center gap-5">
            {[
              { label: t("dash_income_label"), bg: "bg-emerald-400" },
              { label: t("dash_expense_label"), bg: "bg-rose-400" },
              { label: t("dash_balance_label"), bg: "bg-blue-400" },
            ].map(({ label, bg }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${bg}`} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map(({ label, value, show, toggle, containerClass, textColor, accentColor, icon }) => (
          <div
            key={label}
            className={`rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 backdrop-blur-md shadow-lg border ${containerClass}`}
          >
            <div
              className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 dark:opacity-20 pointer-events-none transition-transform group-hover:scale-150 duration-500"
              style={{ backgroundColor: accentColor }}
            />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-white/70 dark:bg-black/30">
                  {icon}
                </div>
                <span className={`text-sm font-bold tracking-wide ${textColor} opacity-85`}>{label}</span>
              </div>
              <button
                onClick={toggle}
                className="hover:scale-110 shadow-sm transition-all bg-white/60 dark:bg-black/30 rounded-xl p-2 flex items-center"
                aria-label={show ? "ซ่อน" : "แสดง"}
              >
                {show ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={textColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={textColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
            <p className={`text-3xl font-extrabold relative z-10 drop-shadow-sm ${textColor}`}>
              {show ? value.toLocaleString() : "••••••"}{" "}
              <span className="text-lg opacity-80">{show ? "฿" : ""}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart — monthly */}
      {monthlyData.hasData && (
        <div className="glass-card rounded-3xl shadow-xl shadow-sky-900/5 p-6 mb-8 relative overflow-hidden transition-colors duration-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-100 dark:bg-sky-900/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600 dark:text-sky-400">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{t("dash_monthly")}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t("dash_monthly_sub")}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /><span className="text-xs text-slate-500 dark:text-slate-400">{t("dash_income_label")}</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400" /><span className="text-xs text-slate-500 dark:text-slate-400">{t("dash_expense_label")}</span></div>
            </div>
          </div>
          <Bar
            data={{
              labels: monthlyData.labels,
              datasets: [
                { label: t("dash_income_label"), data: monthlyData.income, backgroundColor: "rgba(52, 211, 153,0.8)", borderRadius: 8, borderSkipped: false },
                { label: t("dash_expense_label"), data: monthlyData.expense, backgroundColor: "rgba(248,113,113,0.8)", borderRadius: 8, borderSkipped: false },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 2,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: isDark ? "rgba(15,23,42,0.95)" : "rgba(15,23,42,0.88)",
                  titleFont: { family: "Kanit, sans-serif", size: 13 },
                  bodyFont: { family: "Kanit, sans-serif", size: 13 },
                  titleColor: "#f1f5f9", bodyColor: "#e2e8f0",
                  padding: 12, cornerRadius: 10,
                  callbacks: { label: (ctx) => `  ${ctx.raw.toLocaleString()} ฿` },
                },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { font: { family: "Kanit, sans-serif", size: 12 }, color: isDark ? "#64748b" : "#94a3b8" },
                  border: { display: false },
                },
                y: {
                  grid: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
                  ticks: {
                    font: { family: "Kanit, sans-serif", size: 11 },
                    color: isDark ? "#64748b" : "#94a3b8",
                    callback: (v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v,
                  },
                  border: { display: false },
                },
              },
              animation: { duration: 800, easing: "easeInOutQuart" },
            }}
          />
        </div>
      )}
    </>
  );
}