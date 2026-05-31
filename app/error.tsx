"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Something went wrong. Please try again.</p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-bold text-white text-sm"
          style={{ background: "linear-gradient(135deg, #0284c7, #075985)" }}
        >
          ลองใหม่ / Retry
        </button>
      </div>
    </div>
  );
}
