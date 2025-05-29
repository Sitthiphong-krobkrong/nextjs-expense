// app/hooks/useLocalStorageState.ts
'use client';

import { useState, useEffect } from 'react';

export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // โหลดจาก storage ทีเดียวตอน init
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // ซิงก์ทุกครั้งที่ state เปลี่ยน (แต่ไม่ต้อง skip รอบแรก เพราะ init โหลดจบแล้ว)
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      console.error('Cannot write to localStorage');
    }
  }, [key, state]);

  return [state, setState];
}
