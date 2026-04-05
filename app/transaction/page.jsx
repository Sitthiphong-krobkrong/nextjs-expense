"use client";
import { useState, useMemo } from "react";
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/transactionService";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import Dashboard from "../../components/Dashboard";
import Swal from "sweetalert2";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const [editingTx, setEditingTx] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach(tx => {
      if (tx.date) months.add(tx.date.substring(0, 7));
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (selectedMonth !== "all" && tx.date && !tx.date.startsWith(selectedMonth)) {
        return false;
      }
      if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [transactions, selectedMonth, searchQuery]);

  const handleSave = (tx) => {
    const updated = editingTx
      ? updateTransaction(tx, transactions)
      : addTransaction(tx, transactions);
    setTransactions(updated);
    setEditingTx(null);
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการลบรายการ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!isConfirmed) return;
    const updated = deleteTransaction(id, transactions);
    setTransactions(updated);
    Swal.fire({
      title: "ลบสำเร็จ!",
      text: "รายการถูกลบเรียบร้อยแล้ว",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 pt-4 relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow-sm border transition-colors bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600 border-cyan-100/50 dark:bg-slate-800/80 dark:text-cyan-400 dark:border-slate-700/50 dark:from-slate-800/80 dark:to-slate-800/80">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
             </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight text-gradient-primary dark:text-gradient-primary">
            ภาพรวมการเงิน
          </h1>
          <p className="font-medium text-gray-500 dark:text-slate-400">จัดการรายรับและรายจ่ายของคุณได้อย่างง่ายดาย</p>
        </div>

        {/* Filter Bar */}
        <div className="glass-card rounded-2xl shadow-lg shadow-cyan-900/5 p-4 mb-6 relative z-10 flex flex-col sm:flex-row gap-4 transition-colors duration-300">
          {/* Search */}
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-slate-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="ค้นหารายการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm transition-colors bg-white/60 border-gray-200 text-gray-700 placeholder-gray-400 dark:bg-slate-900/50 dark:border-slate-700/50 dark:text-slate-100 dark:placeholder-slate-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                aria-label="ลบคำค้นหา"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          {/* Month Filter */}
          <div className="sm:w-48 relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-sm appearance-none cursor-pointer transition-colors bg-white/60 border-gray-200 text-gray-700 dark:bg-slate-900/50 dark:border-slate-700/50 dark:text-slate-100"
            >
              <option value="all">ทุกเดือน</option>
              {availableMonths.map(month => {
                const [yyyy, mm] = month.split("-");
                const date = new Date(yyyy, parseInt(mm) - 1);
                const label = date.toLocaleDateString("th-TH", { month: "long", year: "numeric", timeZone: "Asia/Bangkok" });
                return <option key={month} value={month}>{label}</option>;
              })}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-slate-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>
        </div>

        <Dashboard transactions={filteredTransactions} />
        <TransactionForm
          key={editingTx ? editingTx.id : "new"}
          onSave={handleSave}
          editing={editingTx}
          onCancel={() => setEditingTx(null)}
        />
        <TransactionList
          items={filteredTransactions}
          onEdit={(tx) => setEditingTx(tx)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
