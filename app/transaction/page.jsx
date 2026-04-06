"use client";
import { useState } from "react";
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
import { useLang } from "../hooks/useLanguage";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const [editingTx, setEditingTx] = useState(null);
  const { t } = useLang();

  const handleSave = (tx) => {
    const updated = editingTx
      ? updateTransaction(tx, transactions)
      : addTransaction(tx, transactions);
    setTransactions(updated);
    setEditingTx(null);
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: t("swal_confirm_delete_title"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("swal_confirm_delete_yes"),
      cancelButtonText: t("swal_cancel"),
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!isConfirmed) return;
    const updated = deleteTransaction(id, transactions);
    setTransactions(updated);
    Swal.fire({
      title: t("swal_deleted_title"),
      text: t("swal_deleted_text"),
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
            {t("page_title")}
          </h1>
          <p className="font-medium text-gray-500 dark:text-slate-400">{t("page_subtitle")}</p>
        </div>

        <Dashboard transactions={transactions} />
        <TransactionForm
          key={editingTx ? editingTx.id : "new"}
          onSave={handleSave}
          editing={editingTx}
          onCancel={() => setEditingTx(null)}
        />
        <TransactionList
          items={transactions}
          onEdit={(tx) => setEditingTx(tx)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
