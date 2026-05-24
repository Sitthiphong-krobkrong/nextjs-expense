"use client";
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { loadFixedCosts, applyDueFixedCosts } from "../services/fixedCostService";
import { loadTransactions, addTransactionsBatch } from "../services/transactionService";
import { useLang } from "../app/hooks/useLanguage";

// รัน applyDueFixedCosts ครั้งเดียวต่อ session โดยไม่ขึ้นกับ route ที่ผู้ใช้เข้า
// (เดิมรันเฉพาะใน /transaction → ถ้าผู้ใช้เข้า /calendar หรือ /add ตรง ๆ จะไม่ trigger)
export default function FixedCostApplier() {
  const ranOnce = useRef(false);
  const { t } = useLang();

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const fixedCosts = loadFixedCosts();
    if (!fixedCosts.length) return;

    const { applied } = applyDueFixedCosts(fixedCosts);
    if (!applied.length) return;

    addTransactionsBatch(applied, loadTransactions());
    window.dispatchEvent(new Event("transactions-updated"));

    Swal.fire({
      title: t("swal_fixed_applied_title"),
      text: `${applied.length} ${t("swal_fixed_applied_text")}`,
      icon: "info",
      timer: 2500,
      showConfirmButton: false,
    });
  }, [t]);

  return null;
}
