const STORAGE_KEY = 'fixedCosts';

export function loadFixedCosts() {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function persist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addFixedCost(fc, list) {
  const now = new Date();
  const currentMonth = now.toISOString().substring(0, 7);
  const currentYear = String(now.getFullYear());

  // ตั้ง lastApplied เป็นเดือน/ปี *ก่อนหน้า* เพื่อให้ applyDueFixedCosts ตัดรอบเดือนนี้ได้
  // เมื่อผู้ใช้กลับไปหน้าหลัก → applyDueFixedCosts จะเช็คและ apply ให้อัตโนมัติ
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastApplied = fc.frequency === 'yearly'
    ? String(now.getFullYear() - 1)
    : prev.toISOString().substring(0, 7);

  const item = { ...fc, id: Date.now(), lastApplied, createdAt: now.toISOString() };
  const updated = [...list, item];
  persist(updated);
  return updated;
}

export function updateFixedCost(fc, list) {
  const updated = list.map((f) => (f.id === fc.id ? fc : f));
  persist(updated);
  return updated;
}

export function deleteFixedCost(id, list) {
  const updated = list.filter((f) => f.id !== id);
  persist(updated);
  return updated;
}

export function toggleFixedCost(id, list) {
  const updated = list.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f));
  persist(updated);
  return updated;
}

// Returns { applied: Transaction[], updatedFixedCosts: FixedCost[] }
export function applyDueFixedCosts(fixedCosts) {
  const today = new Date();
  const currentMonth = today.toISOString().substring(0, 7); // "YYYY-MM"
  const currentYear = String(today.getFullYear());           // "YYYY"

  const applied = [];
  const updatedFixedCosts = fixedCosts.map((fc) => {
    if (!fc.isActive) return fc;

    // ถ้า lastApplied หายไป (เช่น จาก edit เก่า) ให้ตั้งเป็นเดือน/ปีปัจจุบัน เพื่อไม่ให้ apply ซ้ำ
    if (!fc.lastApplied) {
      const fallback = fc.frequency === 'yearly' ? currentYear : currentMonth;
      return { ...fc, lastApplied: fallback };
    }

    const startDate = new Date(fc.startDate);
    // ป้องกัน startDate ที่เป็นปี 2 หลัก (เช่น 0069 จากการกรอก 69) ถูก parse เป็นอดีต
    // ถ้าปีน้อยกว่า 100 ถือว่าผิดปกติ → ข้ามไม่ apply
    if (startDate.getFullYear() < 100) return fc;
    if (today < startDate) return fc;

    if (fc.frequency === 'monthly') {
      if (fc.lastApplied === currentMonth) return fc;
      if (today.getDate() < fc.dayOfMonth) return fc;

      const txDate = new Date(today.getFullYear(), today.getMonth(), fc.dayOfMonth);
      const y = txDate.getFullYear();
      const m = String(txDate.getMonth() + 1).padStart(2, '0');
      const d = String(txDate.getDate()).padStart(2, '0');
      applied.push({ description: fc.description, amount: fc.amount, type: fc.type, date: `${y}-${m}-${d}T00:00:00.000`, isFixed: true });
      return { ...fc, lastApplied: currentMonth };
    }

    if (fc.frequency === 'yearly') {
      if (fc.lastApplied === currentYear) return fc;
      const start = new Date(fc.startDate);
      if (today.getMonth() < start.getMonth()) return fc;
      if (today.getMonth() === start.getMonth() && today.getDate() < start.getDate()) return fc;

      const txDate = new Date(today.getFullYear(), start.getMonth(), start.getDate());
      const y = txDate.getFullYear();
      const m = String(txDate.getMonth() + 1).padStart(2, '0');
      const d = String(txDate.getDate()).padStart(2, '0');
      applied.push({ description: fc.description, amount: fc.amount, type: fc.type, date: `${y}-${m}-${d}T00:00:00.000`, isFixed: true });
      return { ...fc, lastApplied: currentYear };
    }

    return fc;
  });

  persist(updatedFixedCosts);
  return { applied, updatedFixedCosts };
}
