"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
} from "../../services/transactionService";
import TransactionForm from "../../components/TransactionForm";
import FixedCostManager from "../../components/FixedCostManager";
import { useLang } from "../hooks/useLanguage";

function AddPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("edit");
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const [tab, setTab] = useState("add");
  const { t } = useLang();

  const editingTx = editId
    ? transactions.find((tx) => String(tx.id) === editId) || null
    : null;

  const handleSave = (tx) => {
    const updated = editingTx
      ? updateTransaction(tx, transactions)
      : addTransaction(tx, transactions);
    setTransactions(updated);
    // Notify other pages (e.g. transaction list) that data changed
    window.dispatchEvent(new Event("transactions-updated"));
    // โหมดแก้ไข: กลับหน้าหลักทันที
    // โหมดเพิ่มใหม่: TransactionForm จะถามผู้ใช้เองผ่าน onNavigateHome
    if (editingTx) router.push("/");
  };

  const handleCancel = () => router.push("/");
  const handleNavigateHome = () => router.push("/");

  if (editingTx) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 pt-4">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow-sm border bg-gradient-to-br from-sky-50 to-sky-50 text-sky-600 border-sky-100/50 dark:bg-slate-800/80 dark:text-sky-400 dark:border-slate-700/50 dark:from-slate-800/80 dark:to-slate-800/80">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight text-gradient-primary dark:text-gradient-primary">
              {t("edit_page_title")}
            </h1>
            <p className="font-medium text-gray-500 dark:text-slate-400">{t("edit_page_subtitle")}</p>
          </div>
          <TransactionForm key={editingTx.id} onSave={handleSave} editing={editingTx} onCancel={handleCancel} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow-sm border transition-colors ${
            tab === "add"
              ? "bg-gradient-to-br from-sky-50 to-sky-50 text-sky-600 border-sky-100/50 dark:from-slate-800/80 dark:to-slate-800/80 dark:text-sky-400 dark:border-slate-700/50"
              : "bg-gradient-to-br from-violet-50 to-purple-50 text-violet-600 border-violet-100/50 dark:from-slate-800/80 dark:to-slate-800/80 dark:text-violet-400 dark:border-slate-700/50"
          }`}>
            {tab === "add" ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
              </svg>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight text-gradient-primary dark:text-gradient-primary">
            {tab === "add" ? t("add_page_title") : t("fixed_title")}
          </h1>
          <p className="font-medium text-gray-500 dark:text-slate-400">
            {tab === "add" ? t("add_page_subtitle") : t("fixed_subtitle")}
          </p>
        </div>

        <div className="flex gap-2 mb-6 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl">
          <button
            onClick={() => setTab("add")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === "add"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t("add_page_title")}
          </button>
          <button
            onClick={() => setTab("fixed")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              tab === "fixed"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
            {t("fixed_title")}
          </button>
        </div>

        {tab === "add" ? (
          <TransactionForm
            key="new"
            onSave={handleSave}
            editing={null}
            onCancel={handleCancel}
            onNavigateHome={handleNavigateHome}
          />
        ) : (
          <FixedCostManager />
        )}

        <div className="h-20 sm:h-0" />
      </div>
    </div>
  );
}

export default function AddPage() {
  return (
    <Suspense fallback={null}>
      <AddPageContent />
    </Suspense>
  );
}
