"use client";
import { useState, useEffect } from "react";
import {
  loadTransactions,
  addTransactionsBatch,
  deleteTransaction,
} from "../../services/transactionService";
import { loadFixedCosts, applyDueFixedCosts } from "../../services/fixedCostService";
import TransactionList from "../../components/TransactionList";
import Dashboard from "../../components/Dashboard";
import Swal from "sweetalert2";
import { useLang } from "../hooks/useLanguage";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const { t } = useLang();
  const router = useRouter();

  // Re-read localStorage on mount and when transactions change in another page
  useEffect(() => {
    const refresh = () => setTransactions(loadTransactions());
    // Listen for custom event dispatched after saving in /add page
    window.addEventListener("transactions-updated", refresh);
    // Also refresh on mount
    refresh();
    return () => window.removeEventListener("transactions-updated", refresh);
  }, []);

  useEffect(() => {
    const fixedCosts = loadFixedCosts();
    if (!fixedCosts.length) return;
    const { applied } = applyDueFixedCosts(fixedCosts);
    if (!applied.length) return;

    const list = addTransactionsBatch(applied, loadTransactions());
    setTransactions(list);

    Swal.fire({
      title: t("swal_fixed_applied_title"),
      text: `${applied.length} ${t("swal_fixed_applied_text")}`,
      icon: "info",
      timer: 2500,
      showConfirmButton: false,
    });
  }, []);

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
          <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow-sm border transition-colors bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-600 border-emerald-100/50 dark:bg-slate-800/80 dark:text-emerald-400 dark:border-slate-700/50 dark:from-slate-800/80 dark:to-slate-800/80">
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

        {/* Add button for desktop */}
        <div className="hidden sm:flex justify-end mb-4">
          <Link
            href="/add"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #059669, #065f46)",
              boxShadow: "0 8px 16px rgba(5, 150, 105, 0.25)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t("nav_add")}
          </Link>
        </div>

        <TransactionList
          items={transactions}
          onEdit={(tx) => router.push(`/add?edit=${tx.id}`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
