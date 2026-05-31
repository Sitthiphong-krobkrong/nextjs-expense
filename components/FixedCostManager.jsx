"use client";
import { useState, useEffect } from "react";
import {
  loadFixedCosts,
  addFixedCost,
  updateFixedCost,
  deleteFixedCost,
  toggleFixedCost,
  applyDueFixedCosts,
} from "../services/fixedCostService";
import { loadTransactions, addTransactionsBatch } from "../services/transactionService";
import Swal from "sweetalert2";
import { useLang } from "../app/hooks/useLanguage";
import { getCategoriesForType, defaultCategoryFor, COLOR_CLASSES } from "../lib/categories";

const EMPTY_FORM = {
  description: "",
  amount: "",
  type: "expense",
  category: defaultCategoryFor("expense"),
  frequency: "monthly",
  dayOfMonth: 1,
  startDate: new Date().toLocaleDateString("en-CA"),
  isActive: true,
};

export default function FixedCostManager() {
  const { t, lang } = useLang();
  const [fixedCosts, setFixedCosts] = useState(() => loadFixedCosts());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  // Sync state when FixedCostApplier (in layout) applies costs and updates localStorage
  useEffect(() => {
    const sync = () => setFixedCosts(loadFixedCosts());
    window.addEventListener("transactions-updated", sync);
    return () => window.removeEventListener("transactions-updated", sync);
  }, []);

  const freshEmptyForm = () => ({ ...EMPTY_FORM, startDate: new Date().toLocaleDateString("en-CA") });

  const openAdd = () => {
    setForm(freshEmptyForm());
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (fc) => {
    setForm({
      description: fc.description,
      amount: String(fc.amount),
      type: fc.type,
      category: fc.category || defaultCategoryFor(fc.type),
      frequency: fc.frequency,
      dayOfMonth: fc.dayOfMonth,
      startDate: fc.startDate,
      isActive: fc.isActive,
      lastApplied: fc.lastApplied,
      createdAt: fc.createdAt,
    });
    setEditingId(fc.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(freshEmptyForm());
  };

  const handleSave = async () => {
    if (!form.description.trim()) {
      Swal.fire({ icon: "warning", title: t("swal_error_desc"), confirmButtonText: t("swal_ok") });
      return;
    }
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) {
      Swal.fire({ icon: "warning", title: t("swal_error_amount"), confirmButtonText: t("swal_ok") });
      return;
    }

    // ตรวจสอบ startDate — ป้องกันปี 2 หลัก (เช่น 69 → 0069)
    const startYear = new Date(form.startDate).getFullYear();
    if (!form.startDate || startYear < 1900 || startYear > 2200) {
      Swal.fire({ icon: "warning", title: t("swal_error_date"), confirmButtonText: t("swal_ok") });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: t("swal_confirm_save_title"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("swal_confirm_save_yes"),
      cancelButtonText: t("swal_cancel"),
      confirmButtonColor: "#0284c7",
      cancelButtonColor: "#6b7280",
    });
    if (!isConfirmed) return;

    // Reload from localStorage to avoid overwriting lastApplied that FixedCostApplier may have just updated
    const freshList = loadFixedCosts();
    const payload = { ...form, amount, dayOfMonth: Number(form.dayOfMonth) };
    let updatedList;
    if (editingId) {
      // Preserve lastApplied from storage — don't let stale form value overwrite it
      const freshItem = freshList.find((f) => f.id === editingId);
      const safePayload = { ...payload, id: editingId, lastApplied: freshItem?.lastApplied ?? form.lastApplied };
      updatedList = updateFixedCost(safePayload, freshList);
    } else {
      updatedList = addFixedCost(payload, freshList);
    }

    // Apply ทันทีหลัง save — ไม่ต้องรอกลับหน้าหลัก
    const { applied, updatedFixedCosts } = applyDueFixedCosts(updatedList);
    setFixedCosts(updatedFixedCosts);

    if (applied.length > 0) {
      addTransactionsBatch(applied, loadTransactions());
      window.dispatchEvent(new Event("transactions-updated"));
    }

    handleCancel();

    if (applied.length > 0) {
      Swal.fire({
        icon: "success",
        title: t("swal_saved_title"),
        text: `${applied.length} ${t("swal_fixed_applied_text")}`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: t("swal_saved_title"),
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: t("swal_confirm_delete_fixed"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("swal_confirm_delete_yes"),
      cancelButtonText: t("swal_cancel"),
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!isConfirmed) return;
    setFixedCosts(deleteFixedCost(id, loadFixedCosts()));
  };

  const appliedThisMonth = (fc) => {
    const now = new Date();
    if (fc.frequency === "monthly") {
      const localMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      return fc.lastApplied === localMonth;
    }
    if (fc.frequency === "yearly") return fc.lastApplied === String(now.getFullYear());
    return false;
  };

  const pendingLabel = (fc) => {
    if (fc.frequency === "monthly")
      return lang === "th" ? `รอวันที่ ${fc.dayOfMonth}` : `Due day ${fc.dayOfMonth}`;
    if (fc.frequency === "yearly") {
      const d = new Date(fc.startDate);
      return lang === "th"
        ? `รอ ${d.toLocaleDateString("th-TH", { month: "short", day: "numeric" })}`
        : `Due ${d.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`;
    }
    return t("fixed_pending");
  };

  const frequencyLabel = (fc) => {
    if (fc.frequency === "monthly")
      return lang === "th" ? `ทุกวันที่ ${fc.dayOfMonth} ของเดือน` : `Every month on day ${fc.dayOfMonth}`;
    if (fc.frequency === "yearly") {
      const d = new Date(fc.startDate);
      return lang === "th"
        ? `ทุกปี ${d.toLocaleDateString("th-TH", { month: "long", day: "numeric" })}`
        : `Every year on ${d.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`;
    }
    return fc.frequency;
  };

  return (
    <div>
      {/* Add button */}
      {!showForm && (
        <div className="flex justify-end mb-4">
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white text-sm transition-transform hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 8px 16px rgba(124,58,237,0.25)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
            {t("fixed_add")}
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="glass-card rounded-3xl shadow-xl p-6 mb-6 border border-violet-100/50 dark:border-slate-700/50">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-5">
            {editingId ? t("fixed_edit") : t("fixed_add")}
          </h2>

          {/* Type toggle */}
          <div className="flex gap-2 mb-4">
            {["expense", "income"].map((tp) => (
              <button
                key={tp}
                onClick={() => setForm((f) => ({ ...f, type: tp, category: defaultCategoryFor(tp) }))}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  form.type === tp
                    ? tp === "expense"
                      ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                      : "bg-sky-500 text-white shadow-md shadow-sky-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                }`}
              >
                {tp === "expense" ? t("form_expense") : t("form_income")}
              </button>
            ))}
          </div>

          {/* Category picker */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{t("form_category")}</label>
            <div className={`grid gap-2 ${form.type === "income" ? "grid-cols-3" : "grid-cols-4"}`}>
              {getCategoriesForType(form.type).map((c) => {
                const selected = form.category === c.id;
                const cc = COLOR_CLASSES[c.color];
                const Icon = c.Icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: c.id }))}
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 transition-all text-[11px] font-bold ${
                      selected
                        ? `${cc.bg} ${cc.text} border-current shadow-sm`
                        : "bg-white/50 dark:bg-slate-900/30 border-transparent text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon size={16} />
                    {t(c.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{t("form_amount")}</label>
            <input
              type="number" min="0" value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-violet-400/50"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{t("form_description")}</label>
            <input
              type="text" value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder={t("form_description_placeholder")}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400/50"
            />
          </div>

          {/* Frequency */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{t("fixed_frequency")}</label>
            <div className="flex gap-2">
              {["monthly", "yearly"].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setForm((f) => ({ ...f, frequency: freq }))}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    form.frequency === freq
                      ? "bg-violet-500 text-white shadow-md shadow-violet-500/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {freq === "monthly" ? t("fixed_monthly") : t("fixed_yearly")}
                </button>
              ))}
            </div>
          </div>

          {/* Day of month */}
          {form.frequency === "monthly" && (
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                {t("fixed_day_of_month")} (1–31)
              </label>
              <input
                type="number" min="1" max="31" value={form.dayOfMonth}
                onChange={(e) => setForm((f) => ({ ...f, dayOfMonth: Math.min(31, Math.max(1, Number(e.target.value))) }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-400/50"
              />
              {form.dayOfMonth > 28 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5">
                  {lang === "th"
                    ? `เดือนที่ไม่มีวันที่ ${form.dayOfMonth} จะตัดในวันสุดท้ายของเดือนแทน`
                    : `Months without day ${form.dayOfMonth} will fall on the last day of that month`}
                </p>
              )}
            </div>
          )}

          {/* Start date */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{t("fixed_start_date")}</label>
            <input
              type="date" value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-violet-400/50"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl font-bold text-white text-sm hover:-translate-y-0.5 transition-transform"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", boxShadow: "0 8px 16px rgba(124,58,237,0.25)" }}
            >
              {t("fixed_save")}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {t("fixed_cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {fixedCosts.length === 0 && !showForm && (
        <div className="glass-card rounded-3xl p-10 text-center border border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-500 dark:text-violet-400">
              <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
          </div>
          <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{t("fixed_empty")}</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">{t("fixed_empty_sub")}</p>
        </div>
      )}

      {/* Fixed cost cards */}
      <div className="flex flex-col gap-3">
        {fixedCosts.map((fc) => {
          const isApplied = appliedThisMonth(fc);
          return (
            <div
              key={fc.id}
              className={`glass-card rounded-2xl p-4 border transition-all ${
                fc.isActive ? "border-slate-200/60 dark:border-slate-700/60" : "border-slate-200/40 dark:border-slate-700/40 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const cat = getCategoryById(fc.category, fc.type);
                  const cc = COLOR_CLASSES[cat.color];
                  const Icon = cat.Icon;
                  return (
                    <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center shadow ${cc.bg} ${cc.text}`}>
                      <Icon size={20} />
                    </div>
                  );
                })()}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 truncate">{fc.description}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isApplied
                        ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                    }`}>
                      {isApplied ? t("fixed_applied") : pendingLabel(fc)}
                    </span>
                  </div>
                  <p className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                    {fc.amount.toLocaleString()} <span className="text-xs font-medium text-slate-400">฿</span>
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{frequencyLabel(fc)}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => setFixedCosts(toggleFixedCost(fc.id, loadFixedCosts()))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${fc.isActive ? "bg-violet-500" : "bg-slate-300 dark:bg-slate-600"}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${fc.isActive ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-[10px] font-semibold text-slate-400">{fc.isActive ? t("fixed_active") : t("fixed_paused")}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  onClick={() => openEdit(fc)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  {lang === "th" ? "แก้ไข" : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(fc.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  {lang === "th" ? "ลบ" : "Delete"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
