"use client";
import { useMemo, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ transactions }) {
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
          borderColor: "#fff",
        },
      ],
    }),
    [income, expense, balance]
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
      gradient: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
      textColor: "#065f46",
      accentColor: "#10b981",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
          <path d="M12 19V5M5 12l7 7 7-7"/>
        </svg>
      ),
    },
    {
      label: "รายจ่ายทั้งหมด",
      value: expense,
      show: showExpense,
      toggle: () => setShowExpense((p) => !p),
      gradient: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
      textColor: "#7f1d1d",
      accentColor: "#ef4444",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
          <path d="M12 5v14M5 12l7-7 7 7"/>
        </svg>
      ),
    },
    {
      label: "ยอดคงเหลือ",
      value: balance,
      show: showBalance,
      toggle: () => setShowBalance((p) => !p),
      gradient: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
      textColor: "#0c4a6e",
      accentColor: "#0ea5e9",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5">
          <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Pie Chart Card */}
      <div className="mb-5 glass-card rounded-2xl shadow-lg p-6 flex flex-col items-center" style={{
        boxShadow: "0 4px 24px rgba(14, 116, 144, 0.1)",
      }}>
        <div style={{ width: "220px", height: "220px" }}>
          <Pie
            data={pieData}
            options={{
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    font: { family: "Kanit, sans-serif", size: 13 },
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => ` ${ctx.label}: ${ctx.raw.toLocaleString()} ฿`,
                  },
                },
              },
              animation: { animateRotate: true, duration: 600 },
            }}
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {statCards.map(({ label, value, show, toggle, gradient, textColor, accentColor, icon }) => (
          <div
            key={label}
            className="rounded-2xl p-5 shadow-md"
            style={{
              background: gradient,
              boxShadow: `0 4px 16px ${accentColor}25`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.7)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  {icon}
                </div>
                <span className="text-sm font-medium" style={{ color: textColor, opacity: 0.8 }}>{label}</span>
              </div>
              <button
                onClick={toggle}
                style={{
                  background: "rgba(255,255,255,0.5)", border: "none", cursor: "pointer",
                  borderRadius: "8px", padding: "6px", display: "flex", alignItems: "center",
                }}
                aria-label={show ? "ซ่อน" : "แสดง"}
              >
                {show ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
            <p className="text-2xl font-bold" style={{ color: textColor }}>
              {show ? `${value.toLocaleString()} ฿` : "••••••"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
