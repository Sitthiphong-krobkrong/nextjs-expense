"use client";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import useSpeechRecognition from "../app/hooks/useSpeechRecognition";

export default function TransactionForm({ onSave, editing, onCancel }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const loadingTimeout = useRef();

  const { isListening, isSupported, error: speechError, startListening, stopListening } = useSpeechRecognition();

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      return;
    }
    startListening((result) => {
      if (result.amount) setAmount(result.amount);
      if (result.description) setDescription(result.description);
      setType(result.type);
      Swal.fire({
        icon: "success",
        title: "รับเสียงสำเร็จ",
        html: `<div class="text-left text-sm">
          <p><b>คำพูด:</b> ${result.transcript}</p>
          <p><b>รายละเอียด:</b> ${result.description || "-"}</p>
          <p><b>จำนวนเงิน:</b> ${result.amount || "-"}</p>
          <p><b>ประเภท:</b> ${result.type === "income" ? "รายรับ" : "รายจ่าย"}</p>
        </div>`,
        confirmButtonText: "ตกลง",
      });
    });
  };

  useEffect(() => {
    if (editing) {
      setDescription(editing.description);
      setAmount(String(editing.amount));
      setType(editing.type);
    }
  }, [editing]);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await Swal.fire({
      title: "ยืนยันการบันทึกรายการ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, บันทึก",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#0e7490",
      cancelButtonColor: "#6b7280",
    });
    if (!result.isConfirmed) return;

    if (!description.trim()) {
      await Swal.fire({ icon: "error", title: "กรุณากรอกรายละเอียด", confirmButtonText: "ตกลง" });
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      await Swal.fire({ icon: "error", title: "จำนวนเงินต้องเป็นตัวเลขมากกว่า 0", confirmButtonText: "ตกลง" });
      return;
    }
    if (type !== "income" && type !== "expense") {
      await Swal.fire({ icon: "error", title: "ประเภทไม่ถูกต้อง", confirmButtonText: "ตกลง" });
      return;
    }

    const tx = {
      id: editing ? editing.id : Date.now(),
      description,
      amount: parsedAmount,
      type,
      date: new Date().toISOString(),
    };
    onSave(tx);
    setDescription("");
    setAmount("");
    setType("expense");

    await Swal.fire({
      icon: "success",
      title: "บันทึกรายการเรียบร้อย",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#0e7490",
    });
  }

  const inputClass = "w-full mt-1 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-gray-800 placeholder-gray-400 text-base";

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl shadow-lg mb-5 overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(14, 116, 144, 0.12)" }}
    >
      {/* Form header */}
      <div className="px-5 py-4 border-b border-gray-100" style={{
        background: editing
          ? "linear-gradient(135deg, #e0f2fe, #cffafe)"
          : "linear-gradient(135deg, #d1fae5, #e0f2fe)",
      }}>
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{
          color: editing ? "#0c4a6e" : "#065f46",
        }}>
          {editing ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
          )}
          {editing ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}
        </h2>
      </div>

      <div className="p-5 space-y-4">
        {/* Voice input */}
        {isSupported && (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium shadow-md w-full justify-center"
              style={{
                background: isListening
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #0e7490, #0f4c75)",
                boxShadow: isListening
                  ? "0 4px 14px rgba(239, 68, 68, 0.4)"
                  : "0 4px 14px rgba(14, 116, 144, 0.35)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
              </svg>
              {isListening ? "กำลังฟัง... กดเพื่อหยุด" : "พูดเพื่อบันทึก"}
            </button>
            {isListening && (
              <p className="text-sm text-red-500 font-medium text-center">
                กำลังฟังเสียง... พูดได้เลย เช่น &quot;กินข้าว 50 บาท&quot;
              </p>
            )}
            {speechError && <p className="text-sm text-red-500 text-center">{speechError}</p>}
          </div>
        )}

        {/* Overlay Loading */}
        {showOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
            <svg className="animate-spin mb-4" width={54} height={54} viewBox="0 0 50 50">
              <circle className="opacity-25" cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="4"/>
              <path className="opacity-75" fill="#fff" d="M25 5a20 20 0 0 1 20 20h-4a16 16 0 1 0-16 16V5z"/>
            </svg>
            <div className="text-white text-lg font-bold">กำลังประมวลผล กรุณารอสักครู่...</div>
          </div>
        )}

        {/* Type toggle */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setType("income")}
            className="flex-1 py-3 rounded-xl font-semibold text-sm border-2"
            style={{
              background: type === "income" ? "linear-gradient(135deg, #d1fae5, #a7f3d0)" : "transparent",
              borderColor: type === "income" ? "#10b981" : "#e5e7eb",
              color: type === "income" ? "#065f46" : "#9ca3af",
              boxShadow: type === "income" ? "0 2px 8px rgba(16, 185, 129, 0.25)" : "none",
            }}
          >
            + รายรับ
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className="flex-1 py-3 rounded-xl font-semibold text-sm border-2"
            style={{
              background: type === "expense" ? "linear-gradient(135deg, #fee2e2, #fecaca)" : "transparent",
              borderColor: type === "expense" ? "#ef4444" : "#e5e7eb",
              color: type === "expense" ? "#7f1d1d" : "#9ca3af",
              boxShadow: type === "expense" ? "0 2px 8px rgba(239, 68, 68, 0.25)" : "none",
            }}
          >
            - รายจ่าย
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">จำนวนเงิน (฿)</label>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">รายละเอียด</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="เช่น ค่าข้าว, ค่าน้ำมัน..."
            className={inputClass}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 text-base"
            style={{
              background: "linear-gradient(135deg, #0e7490, #0f4c75)",
              boxShadow: "0 4px 14px rgba(14, 116, 144, 0.4)",
            }}
          >
            {editing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                บันทึก
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                เพิ่ม
              </>
            )}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-xl font-medium border-2 border-gray-200 text-gray-600 flex items-center gap-2 text-base"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              ยกเลิก
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
