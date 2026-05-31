"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { loadFixedCosts, applyDueFixedCosts } from "../services/fixedCostService";
import { loadTransactions, addTransactionsBatch } from "../services/transactionService";
import { useLang } from "../app/hooks/useLanguage";

// ตรวจสอบและ apply fixed costs ครั้งเดียวต่อวัน
// usePathname เป็น dependency เพื่อให้ re-check ทุกครั้งที่ navigate ข้ามหน้า
// checkedDateRef กัน apply ซ้ำในวันเดียวกัน
export default function FixedCostApplier() {
  const checkedDateRef = useRef("");
  const { t } = useLang();
  const pathname = usePathname();

  useEffect(() => {
    const d = new Date();
    const todayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (checkedDateRef.current === todayKey) return;
    checkedDateRef.current = todayKey;

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
  }, [pathname, t]);

  return null;
}
