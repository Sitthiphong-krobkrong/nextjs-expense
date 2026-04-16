"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
} from "../../services/transactionService";
import TransactionForm from "../../components/TransactionForm";
import { useLang } from "../hooks/useLanguage";

export default function AddPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("edit");
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const { t } = useLang();

  const editingTx = editId
    ? transactions.find((tx) => String(tx.id) === editId) || null
    : null;

  const handleSave = (tx) => {
    const updated = editingTx
      ? updateTransaction(tx, transactions)
      : addTransaction(tx, transactions);
    setTransactions(updated);
    router.push("/");
  };

  const handleCancel = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 pt-4 relative z-10">
          <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow-sm border transition-colors ${
            editingTx
              ? "bg-gradient-to-br from-cyan-50 to-blue-50 text-cyan-600 border-cyan-100/50 dark:bg-slate-800/80 dark:text-cyan-400 dark:border-slate-700/50 dark:from-slate-800/80 dark:to-slate-800/80"
              : "bg-gradient-to-br from-emerald-50 to-cyan-50 text-emerald-600 border-emerald-100/50 dark:bg-slate-800/80 dark:text-emerald-400 dark:border-slate-700/50 dark:from-slate-800/80 dark:to-slate-800/80"
          }`}>
            {editingTx ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight text-gradient-primary dark:text-gradient-primary">
            {editingTx ? t("edit_page_title") : t("add_page_title")}
          </h1>
          <p className="font-medium text-gray-500 dark:text-slate-400">
            {editingTx ? t("edit_page_subtitle") : t("add_page_subtitle")}
          </p>
        </div>

        <TransactionForm
          key={editingTx ? editingTx.id : "new"}
          onSave={handleSave}
          editing={editingTx}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
