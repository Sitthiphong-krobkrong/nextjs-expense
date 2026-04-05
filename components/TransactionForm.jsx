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

  const inputClass = `w-full mt-1.5 px-4 py-3.5 border rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 text-base shadow-sm transition-all border-indigo-50 bg-white/60 text-gray-800 placeholder-gray-400 hover:bg-white/90 dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:bg-slate-800/60`;

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-3xl mb-8 overflow-hidden relative transition-colors duration-300"
    >
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Form header */}
      <div className={`px-6 py-5 border-b relative z-10 border-indigo-50/60 dark:border-slate-700/50 ${editing ? 'bg-gradient-to-br from-cyan-100/60 to-cyan-50/60 dark:from-sky-900/15 dark:to-sky-800/15' : 'bg-gradient-to-br from-emerald-50/60 to-cyan-50/60 dark:from-emerald-900/15 dark:to-sky-900/15'}`}>
        <h2 className={`text-lg font-bold flex items-center gap-3 tracking-wide ${editing ? 'text-sky-900 dark:text-sky-300' : 'text-emerald-900 dark:text-emerald-300'}`}>
          {editing ? (
            <div className="p-2 rounded-lg shadow-sm bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          ) : (
            <div className="p-2 rounded-lg shadow-sm bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
          )}
          {editing ? "แก้ไขรายการเงิน" : "เพิ่มรายการใหม่"}
        </h2>
      </div>

      <div className="p-6 sm:p-7 space-y-6 relative z-10">
        {/* Voice input */}
        {isSupported && (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleVoiceInput}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white font-medium shadow-lg w-full justify-center transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: isListening
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #0e7490, #0f4c75)",
                boxShadow: isListening
                  ? "0 4px 14px rgba(239, 68, 68, 0.4)"
                  : "0 8px 20px rgba(14, 116, 144, 0.25)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={isListening ? "animate-pulse" : ""}>
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
              </svg>
              {isListening ? "กำลังฟังคำสั่งของคุณ..." : "ใช้งานด้วยคำสั่งเสียง"}
            </button>
            {isListening && (
              <p className="text-sm text-red-500 font-medium text-center animate-pulse">
                พูดว่า &quot;กินข้าว 50 บาท&quot; หรือ &quot;รับเงินเดือน 30000 บาท&quot;
              </p>
            )}
            {speechError && <p className="text-sm text-red-500 text-center">{speechError}</p>}
          </div>
        )}

        {/* Overlay Loading */}
        {showOverlay && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-[100] transition-opacity duration-300">
            <div className="p-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-xs w-full mx-4 bg-white dark:bg-slate-800">
               <svg className="animate-spin mb-4 text-cyan-700 dark:text-cyan-400" width={48} height={48} viewBox="0 0 50 50">
                 <circle className="opacity-25" cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="4"/>
                 <path className="opacity-75" fill="currentColor" d="M25 5a20 20 0 0 1 20 20h-4a16 16 0 1 0-16 16V5z"/>
               </svg>
               <div className="text-base font-bold text-center text-gray-800 dark:text-slate-200">กำลังประมวลผล...</div>
            </div>
          </div>
        )}

        {/* Type toggle */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm border-2 transition-all hover:shadow-md ${
              type === "income" 
              ? "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 border-emerald-500 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300 shadow-[0_4px_12px_rgba(16,185,129,0.2)]" 
              : "bg-white/50 dark:bg-black/20 border-transparent dark:border-white/5 text-gray-500 dark:text-slate-400"
            }`}
          >
            + รายรับ
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-3.5 rounded-xl font-bold text-sm border-2 transition-all hover:shadow-md ${
              type === "expense" 
              ? "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 border-red-500 text-red-800 dark:border-red-400 dark:text-red-300 shadow-[0_4px_12px_rgba(239,68,68,0.2)]" 
              : "bg-white/50 dark:bg-black/20 border-transparent dark:border-white/5 text-gray-500 dark:text-slate-400"
            }`}
          >
            - รายจ่าย
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
            {/* Amount */}
            <div className="relative">
              <label className="block text-sm font-bold mb-1.5 ml-1 text-gray-700 dark:text-slate-300">จำนวนเงิน (฿)</label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={`${inputClass} ${amount ? "pr-12" : ""}`}
                />
                {amount && (
                  <button
                    type="button"
                    onClick={() => setAmount("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                    aria-label="ลบจำนวนเงิน"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="relative">
              <label className="block text-sm font-bold mb-1.5 ml-1 text-gray-700 dark:text-slate-300">รายละเอียดรายการ</label>
              <div className="relative">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น ค่าข้าว, ค่าน้ำมัน..."
                  className={`${inputClass} ${description ? "pr-12" : ""}`}
                />
                {description && (
                  <button
                    type="button"
                    onClick={() => setDescription("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-100 hover:bg-gray-200 text-gray-500 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300"
                    aria-label="ลบรายละเอียด"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="flex-1 py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 text-base transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #0e7490, #0f4c75)",
              boxShadow: "0 8px 16px rgba(14, 116, 144, 0.25)",
            }}
          >
            {editing ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                บันทึกการแก้ไข
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                บันทึกรายการ
              </>
            )}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3.5 rounded-xl font-bold border shadow-sm flex items-center justify-center gap-2 text-base transition-colors bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              ยกเลิก
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
