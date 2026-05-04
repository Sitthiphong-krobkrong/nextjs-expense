"use client"
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";
import { deleteAllTransactions } from "@/services/transactionService";
import { exportExcelFromLocalStorage, importExcelToLocalStorage } from "@/services/manageService";
import { useLang } from "../hooks/useLanguage";

export default function ManagePage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const isDark = mounted && resolvedTheme === "dark";
    const { t } = useLang();

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10 pt-4 relative z-10">
                    <div className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 shadow-sm border transition-colors ${isDark ? 'bg-slate-800/80 text-emerald-400 border-slate-700/50' : 'bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-600 border-emerald-100/50'}`}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight" style={{
                        background: isDark ? "linear-gradient(135deg, #34d399, #6ee7b7)" : "linear-gradient(135deg, #059669, #065f46)",
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
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border gap-5 hover:shadow-md transition-shadow ${isDark ? 'bg-emerald-900/20 border-emerald-900/50' : 'bg-emerald-50/30 border-emerald-50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl shrink-0 ${isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100/80 text-emerald-600'}`}>
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
                                        confirmButtonColor: "#10b981",
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
                            <span className="block text-center w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:-translate-y-0.5">
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
            </div>
        </div>
    );
}