"use client";
import { useState } from "react";
import {
  loadTransactions,
  deleteTransaction,
} from "../../services/transactionService";
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

        {/* Add button for desktop */}
        <div className="hidden sm:flex justify-end mb-4">
          <Link
            href="/add"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #0e7490, #0f4c75)",
              boxShadow: "0 8px 16px rgba(14, 116, 144, 0.25)",
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
