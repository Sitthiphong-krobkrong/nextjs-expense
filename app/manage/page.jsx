"use client"
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";
import { deleteAllTransactions, loadTransactions, deleteTransaction } from "@/services/transactionService";
import { exportExcelFromLocalStorage, importExcelToLocalStorage } from "@/services/manageService";
import { useLang } from "../hooks/useLanguage";

export default function ManagePage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted && resolvedTheme === "dark";
    const { t, lang } = useLang();
    const [dupes, setDupes] = useState(null); // null = not scanned, [] = clean

    const scanDuplicates = () => {
        const txs = loadTransactions();
        const seen = {};
        const dupIds = new Set();
        txs.forEach((tx) => {
            const key = `${tx.description?.toLowerCase().trim()}|${tx.date?.substring(0,10)}|${tx.amount}|${tx.type}`;
            if (seen[key]) { dupIds.add(tx.id); seen[key].push(tx.id); }
            else seen[key] = [tx.id];
        });
        setDupes(txs.filter((tx) => dupIds.has(tx.id)));
    };

    const deleteDupe = (id) => {
        const txs = loadTransactions();
        deleteTransaction(id, txs);
        setDupes((prev) => prev.filter((d) => d.id !== id));
        window.dispatchEvent(new Event("transactions-updated"));
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10 pt-4 relative z-10">
                    <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow-sm border transition-colors ${isDark ? 'bg-slate-800/80 text-sky-400 border-slate-700/50' : 'bg-gradient-to-br from-sky-50 to-sky-50 text-sky-600 border-sky-100/50'}`}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight" style={{
                        background: isDark ? "linear-gradient(135deg, #38bdf8, #7dd3fc)" : "linear-gradient(135deg, #0284c7, #075985)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        {t("manage_title")}                    </h1>
                    <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{t("manage_subtitle")}</p>
                </div>

                <div className="glass-card rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6 transition-colors duration-300">
                    
                    {/* Export Section */}
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border gap-5 hover:shadow-md transition-shadow ${isDark ? 'bg-blue-900/20 border-blue-900/50' : 'bg-blue-50/30 border-blue-50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shrink-0 ${isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100/80 text-blue-600'}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{t("manage_export_title")}</h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{t("manage_export_sub")}</p>
                            </div>
                        </div>
                        <button
                            className="w-full sm:w-auto shrink-0 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:-translate-y-0.5"
                            onClick={async () => {
                                const result = await Swal.fire({
                                    title: t("swal_export_title"),
                                    text: t("swal_export_text"),
                                    icon: "question",
                                    showCancelButton: true,
                                    confirmButtonText: t("swal_export_yes"),
                                    cancelButtonText: t("swal_cancel"),
                                    confirmButtonColor: "#3b82f6",
                                });
                                if (result.isConfirmed) {
                                    try {
                                        await exportExcelFromLocalStorage();
                                        Swal.fire(t("swal_export_success"), t("swal_export_success_text"), "success");
                                    }
                                    catch (error) {
                                        console.error("Error exporting data:", error);
                                        Swal.fire(t("swal_export_error"), t("swal_export_error_text"), "error");
                                    }
                                }
                            }}
                        >
                            {t("manage_export_btn")}
                        </button>
                    </div>

                    {/* Import Section */}
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border gap-5 hover:shadow-md transition-shadow ${isDark ? 'bg-sky-900/20 border-sky-900/50' : 'bg-sky-50/30 border-sky-50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shrink-0 ${isDark ? 'bg-sky-900/50 text-sky-400' : 'bg-sky-100/80 text-sky-600'}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{t("manage_import_title")}</h3>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{t("manage_import_sub")}</p>
                            </div>
                        </div>
                        <label className="w-full sm:w-auto shrink-0 cursor-pointer">
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    e.target.value = "";
                                    if (!file) return;

                                    const result = await Swal.fire({
                                        title: t("swal_import_title"),
                                        text: t("swal_import_text"),
                                        icon: "question",
                                        showCancelButton: true,
                                        confirmButtonText: t("swal_import_yes"),
                                        cancelButtonText: t("swal_cancel"),
                                        confirmButtonColor: "#0ea5e9",
                                    });
                                    if (!result.isConfirmed) return;

                                    try {
                                        const { count } = await importExcelToLocalStorage(file);
                                        await Swal.fire(
                                            t("swal_import_success"),
                                            t("swal_import_success_text").replace("{count}", count),
                                            "success"
                                        );
                                        window.location.reload();
                                    } catch (error) {
                                        console.error("Error importing data:", error);
                                        Swal.fire(t("swal_import_error"), t("swal_import_error_text"), "error");
                                    }
                                }}
                            />
                            <span className="block text-center w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all hover:-translate-y-0.5">
                                {t("manage_import_btn")}
                            </span>
                        </label>
                    </div>

                    {/* Delete Section */}
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border gap-5 hover:shadow-md transition-shadow ${isDark ? 'bg-red-900/20 border-red-900/50' : 'bg-red-50/30 border-red-50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shrink-0 ${isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100/80 text-red-600'}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{t("manage_delete_title")}</h3>
                                <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-400'}`}>{t("manage_delete_sub")}</p>
                            </div>
                        </div>
                        <button
                            className="w-full sm:w-auto shrink-0 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:-translate-y-0.5"
                            onClick={async () => {
                                const result = await Swal.fire({
                                    title: t("swal_delete_all_title"),
                                    text: t("swal_delete_all_text"),
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: t("swal_delete_all_yes"),
                                    cancelButtonText: t("swal_cancel"),
                                    confirmButtonColor: "#ef4444",
                                    cancelButtonColor: "#6b7280",
                                });
                                if (result.isConfirmed) {
                                    await deleteAllTransactions();
                                    Swal.fire(t("swal_delete_all_done"), t("swal_delete_all_done_text"), "success");
                                }
                            }}
                        >
                            {t("manage_delete_btn")}
                        </button>
                    </div>

                </div>

                {/* Duplicate detector */}
                <div className={`flex flex-col gap-4 p-5 rounded-2xl border hover:shadow-md transition-shadow ${isDark ? "bg-violet-900/10 border-violet-900/50" : "bg-violet-50/30 border-violet-100"}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shrink-0 ${isDark ? "bg-violet-900/50 text-violet-400" : "bg-violet-100/80 text-violet-600"}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z"/>
                                    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className={`text-lg font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}>
                                    {lang === "th" ? "ตรวจสอบรายการซ้ำ" : "Duplicate Detector"}
                                </h3>
                                <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                                    {lang === "th" ? "สแกนหารายการที่ชื่อ+วันที่+จำนวนเหมือนกัน" : "Scan for same description + date + amount"}
                                </p>
                            </div>
                        </div>
                        <button
                            className="w-full sm:w-auto shrink-0 px-6 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium rounded-xl hover:from-violet-600 hover:to-violet-700 shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5"
                            onClick={scanDuplicates}
                        >
                            {lang === "th" ? "สแกน" : "Scan"}
                        </button>
                    </div>

                    {dupes !== null && (
                        dupes.length === 0 ? (
                            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                                {lang === "th" ? "ไม่พบรายการซ้ำ" : "No duplicates found"}
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-bold text-rose-500">
                                    {lang === "th" ? `พบ ${dupes.length} รายการที่อาจซ้ำ` : `Found ${dupes.length} potential duplicates`}
                                </p>
                                <div className="max-h-64 overflow-y-auto flex flex-col gap-1.5">
                                    {dupes.map((tx) => (
                                        <div key={tx.id} className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl ${isDark ? "bg-slate-800/60" : "bg-white/70"}`}>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{tx.description}</p>
                                                <p className="text-xs text-slate-400">{tx.date?.substring(0,10)} · {tx.amount.toLocaleString()}฿</p>
                                            </div>
                                            <button
                                                onClick={() => deleteDupe(tx.id)}
                                                className="shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 transition-colors"
                                            >
                                                {lang === "th" ? "ลบ" : "Delete"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Dev-only: seed test data */}
                {process.env.NODE_ENV === "development" && (
                    <div className={`mt-6 flex flex-col gap-3 p-5 rounded-2xl border border-dashed ${isDark ? "border-yellow-700/50 bg-yellow-900/10" : "border-yellow-300 bg-yellow-50/50"}`}>
                        <p className="text-xs font-extrabold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest">Dev Tools</p>

                        {/* Seed fixed costs */}
                        <button
                            className="w-full py-2.5 rounded-xl font-bold text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
                            onClick={() => {
                                const base = Date.now();
                                const fixedCosts = [
                                    {
                                        id: base + 1,
                                        description: "ค่าเช่า (Monthly / วันที่ 5 / ครบกำหนดแล้ว)",
                                        amount: 8000,
                                        type: "expense",
                                        frequency: "monthly",
                                        dayOfMonth: 5,
                                        startDate: "2026-01-01",
                                        isActive: true,
                                        lastApplied: "2026-04", // เดือนก่อน → ควร apply พ.ค.
                                        createdAt: new Date().toISOString(),
                                    },
                                    {
                                        id: base + 2,
                                        description: "Netflix (Monthly / วันที่ 25 / ครบกำหนดแล้ว)",
                                        amount: 329,
                                        type: "expense",
                                        frequency: "monthly",
                                        dayOfMonth: 25,
                                        startDate: "2026-03-01",
                                        isActive: true,
                                        lastApplied: "2026-04", // เดือนก่อน → ควร apply พ.ค.
                                        createdAt: new Date().toISOString(),
                                    },
                                    {
                                        id: base + 3,
                                        description: "เงินเดือน (Monthly / วันที่ 25 / applied แล้ว)",
                                        amount: 30000,
                                        type: "income",
                                        frequency: "monthly",
                                        dayOfMonth: 25,
                                        startDate: "2026-01-01",
                                        isActive: true,
                                        lastApplied: "2026-05", // เดือนนี้แล้ว → ไม่ควร apply ซ้ำ
                                        createdAt: new Date().toISOString(),
                                    },
                                    {
                                        id: base + 4,
                                        description: "ประกันรายปี (Yearly / ยังไม่ถึงวัน วันที่ 1 มิ.ย.)",
                                        amount: 12000,
                                        type: "expense",
                                        frequency: "yearly",
                                        dayOfMonth: 1,
                                        startDate: "2026-06-01", // วันพรุ่งนี้ → ยังไม่ควร apply
                                        isActive: true,
                                        lastApplied: "2025",
                                        createdAt: new Date().toISOString(),
                                    },
                                    {
                                        id: base + 5,
                                        description: "Backfill 3 เดือน (Monthly / วันที่ 1 / ค้างมาจาก มี.ค.)",
                                        amount: 500,
                                        type: "expense",
                                        frequency: "monthly",
                                        dayOfMonth: 1,
                                        startDate: "2026-03-01",
                                        isActive: true,
                                        lastApplied: "2026-02", // ค้าง 3 เดือน → ควร backfill มี.ค. เม.ย. พ.ค.
                                        createdAt: new Date().toISOString(),
                                    },
                                ];
                                localStorage.setItem("fixedCosts", JSON.stringify(fixedCosts));
                                window.dispatchEvent(new Event("transactions-updated"));
                                Swal.fire({ icon: "success", title: "Seeded fixed costs!", text: `${fixedCosts.length} รายการ`, timer: 1500, showConfirmButton: false });
                            }}
                        >
                            Seed Fixed Costs (5 รายการ)
                        </button>

                        {/* Clear fixed costs only */}
                        <button
                            className="w-full py-2.5 rounded-xl font-bold text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            onClick={() => {
                                localStorage.removeItem("fixedCosts");
                                window.dispatchEvent(new Event("transactions-updated"));
                                Swal.fire({ icon: "success", title: "Cleared fixedCosts", timer: 1200, showConfirmButton: false });
                            }}
                        >
                            Clear Fixed Costs
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}