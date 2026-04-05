"use client";
import { useState } from "react";

export default function TransactionList({ items, onEdit, onDelete }) {
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const sortedItems = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pagedItems = sortedItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div
      className="glass-card rounded-2xl shadow-lg overflow-hidden mb-8"
      style={{ boxShadow: "0 4px 24px rgba(14, 116, 144, 0.1)" }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"
        style={{ background: "linear-gradient(135deg, #e0f2fe, #cffafe)" }}
      >
        <div className="flex items-center gap-3">
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "rgba(255,255,255,0.7)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0e7490" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "#0c4a6e" }}>รายการทั้งหมด</h2>
            <p className="text-xs" style={{ color: "#0e7490" }}>{items.length} รายการ</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {pagedItems.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mb-3">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
          <p className="text-sm">ยังไม่มีรายการ</p>
          <p className="text-xs mt-1">เพิ่มรายการแรกของคุณด้านบน</p>
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="block md:hidden divide-y divide-gray-100">
            {pagedItems.map((tx) => (
              <div key={tx.id} className="px-4 py-4 flex items-center gap-3">
                {/* Amount badge */}
                <div className="flex-shrink-0 w-14 text-right">
                  <span className="font-bold text-sm" style={{ color: tx.type === "expense" ? "#ef4444" : "#10b981" }}>
                    {tx.type === "expense" ? "-" : "+"}{tx.amount.toLocaleString()}
                  </span>
                  <p className="text-xs text-gray-400">฿</p>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={tx.type === "expense"
                        ? { background: "#fee2e2", color: "#b91c1c" }
                        : { background: "#d1fae5", color: "#065f46" }
                      }
                    >
                      {tx.type === "expense" ? "รายจ่าย" : "รายรับ"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {tx.date ? new Date(tx.date).toLocaleDateString("th-TH") : "-"}
                    </span>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onEdit(tx)}
                    aria-label="แก้ไข"
                    className="p-2.5 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                      border: "1px solid #f59e0b30",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    aria-label="ลบ"
                    className="p-2.5 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #fee2e2, #fecaca)",
                      border: "1px solid #ef444430",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2.5">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center w-24">จัดการ</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">จำนวนเงิน</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">รายละเอียด</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">ประเภท</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">วันที่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagedItems.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                    className="hover:bg-cyan-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(tx)}
                          aria-label="แก้ไข"
                          className="p-2 rounded-lg hover:scale-110 transition-transform"
                          style={{
                            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                            border: "1px solid #f59e0b30",
                            boxShadow: "0 1px 4px rgba(245, 158, 11, 0.2)",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(tx.id)}
                          aria-label="ลบ"
                          className="p-2 rounded-lg hover:scale-110 transition-transform"
                          style={{
                            background: "linear-gradient(135deg, #fee2e2, #fecaca)",
                            border: "1px solid #ef444430",
                            boxShadow: "0 1px 4px rgba(239, 68, 68, 0.2)",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2.5">
                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="font-bold text-base"
                        style={{ color: tx.type === "expense" ? "#ef4444" : "#10b981" }}
                      >
                        {tx.type === "expense" ? "-" : "+"}{tx.amount.toLocaleString()} ฿
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">{tx.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={tx.type === "expense"
                          ? { background: "#fee2e2", color: "#b91c1c" }
                          : { background: "#d1fae5", color: "#065f46" }
                        }
                      >
                        {tx.type === "expense" ? "รายจ่าย" : "รายรับ"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {tx.date ? new Date(tx.date).toLocaleDateString("th-TH") : "-"}
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
        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-gray-500">
            หน้า {currentPage} จาก {totalPages}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #e0f2fe, #cffafe)",
                color: "#0c4a6e",
                border: "1px solid #bae6fd",
              }}
            >
              ← ก่อน
            </button>

            {(() => {
              const groupSize = 5;
              const currentGroup = Math.floor((currentPage - 1) / groupSize);
              const start = currentGroup * groupSize + 1;
              const end = Math.min(start + groupSize - 1, totalPages);
              return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{
                    background: currentPage === i
                      ? "linear-gradient(135deg, #0e7490, #0f4c75)"
                      : "#f3f4f6",
                    color: currentPage === i ? "#fff" : "#6b7280",
                    border: "1px solid #e5e7eb",
                    boxShadow: currentPage === i ? "0 2px 8px rgba(14, 116, 144, 0.35)" : "none",
                  }}
                >
                  {i}
                </button>
              ));
            })()}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #e0f2fe, #cffafe)",
                color: "#0c4a6e",
                border: "1px solid #bae6fd",
              }}
            >
              ถัดไป →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
