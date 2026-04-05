import { useMemo, useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "next-themes";

Chart.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ transactions }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const pieData = useMemo(
    () => ({
      labels: ["รายรับ", "รายจ่าย", "ยอดคงเหลือ"],
      datasets: [
        {
          data: [income, expense, Math.max(balance, 0)],
          backgroundColor: ["#4ade80", "#f87171", "#38bdf8"],
          hoverBackgroundColor: ["#22c55e", "#ef4444", "#0ea5e9"],
          borderWidth: 2,
          borderColor: isDark ? "rgba(15, 23, 42, 0.8)" : "#fff",
        },
      ],
    }),
    [income, expense, balance, isDark]
  );

  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const statCards = [
    {
      label: "รายรับทั้งหมด",
      value: income,
      show: showIncome,
      toggle: () => setShowIncome((p) => !p),
      containerClass: "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 shadow-emerald-500/20 border-emerald-500/30",
      textColor: "text-emerald-800 dark:text-emerald-300",
      accentColor: "#10b981", 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-600 dark:text-emerald-400" strokeWidth="2.5">
          <path d="M12 19V5M5 12l7 7 7-7"/>
        </svg>
      ),
    },
    {
      label: "รายจ่ายทั้งหมด",
      value: expense,
      show: showExpense,
      toggle: () => setShowExpense((p) => !p),
      containerClass: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 shadow-red-500/20 border-red-500/30",
      textColor: "text-red-800 dark:text-red-300",
      accentColor: "#ef4444",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-600 dark:text-red-400" strokeWidth="2.5">
          <path d="M12 5v14M5 12l7-7 7 7"/>
        </svg>
      ),
    },
    {
      label: "ยอดคงเหลือ",
      value: balance,
      show: showBalance,
      toggle: () => setShowBalance((p) => !p),
      containerClass: "bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/40 dark:to-sky-800/40 shadow-sky-500/20 border-sky-500/30",
      textColor: "text-sky-900 dark:text-sky-300",
      accentColor: "#0ea5e9",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-sky-600 dark:text-sky-400" strokeWidth="2.5">
          <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Pie Chart Card */}
      <div className="glass-card mb-6 rounded-3xl shadow-xl shadow-cyan-900/5 p-6 sm:p-8 flex flex-col items-center relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none -z-10"></div>
        <div className="relative z-10" style={{ width: "240px", height: "240px", maxWidth: "100%" }}>
          <Pie
            key={`pie-${resolvedTheme}`}
            data={pieData}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              devicePixelRatio: 2,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    font: { family: "Kanit, sans-serif", size: 14, weight: "bold" },
                    padding: 20,
                    usePointStyle: true,
                    pointStyleWidth: 12,
                    color: isDark ? "#e2e8f0" : "#334155",
                  },
                },
                tooltip: {
                  backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(15, 23, 42, 0.9)",
                  titleFont: { family: "Kanit, sans-serif", size: 14 },
                  bodyFont: { family: "Kanit, sans-serif", size: 13 },
                  titleColor: "#f1f5f9",
                  bodyColor: "#e2e8f0",
                  padding: 12,
                  cornerRadius: 8,
                  callbacks: {
                    label: (ctx) => ` ${ctx.label}: ${ctx.raw.toLocaleString()} ฿`,
                  },
                },
              },
              animation: { animateRotate: true, duration: 800 },
              borderWidth: 0,
            }}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map(({ label, value, show, toggle, containerClass, textColor, accentColor, icon }) => (
          <div
            key={label}
            className={`rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 backdrop-blur-md shadow-lg border ${containerClass}`}
          >
            {/* Subtle decorative circle */}
            <div 
              className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 dark:opacity-20 pointer-events-none transition-transform group-hover:scale-150 duration-500" 
              style={{ backgroundColor: accentColor }}
            ></div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors bg-white/70 dark:bg-black/30"
                >
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={textColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
            <p className={`text-3xl font-extrabold relative z-10 drop-shadow-sm ${textColor}`}>
              {show ? `${value.toLocaleString()}` : "••••••"} <span className="text-lg opacity-80">{show ? "฿" : ""}</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
