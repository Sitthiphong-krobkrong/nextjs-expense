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

// แปลง "YYYY-MM-DD" เป็น Date object แบบ local time (ไม่ใช่ UTC)
// เพื่อกัน timezone shift ตอนเทียบกับ today
function parseLocalDate(dateStr) {
  const [y, m, d] = String(dateStr).substring(0, 10).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

// คืนวันสุดท้ายของเดือน (28/29/30/31 ตามจริง)
function lastDayOfMonth(year, monthIdx) {
  return new Date(year, monthIdx + 1, 0).getDate();
}

function monthKey(year, monthIdx) {
  return `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
}

export function addFixedCost(fc, list) {
  const now = new Date();

  // ตั้ง lastApplied เป็นเดือน/ปี *ก่อนหน้า* เพื่อให้ applyDueFixedCosts ตัดรอบเดือนนี้ได้
  // เมื่อผู้ใช้กลับไปหน้าหลัก → applyDueFixedCosts จะเช็คและ apply ให้อัตโนมัติ
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastApplied = fc.frequency === 'yearly'
    ? String(now.getFullYear() - 1)
    : monthKey(prev.getFullYear(), prev.getMonth());

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
// รองรับ:
//  - Backfill ย้อนหลังหลายเดือน/ปี (เปิดแอปครั้งหน้าหลังข้ามรอบ → สร้างทุกเดือนที่ขาด)
//  - Day 30/31 (ถ้าเดือนสั้นกว่า ใช้วันสุดท้ายของเดือนแทน เช่น Feb 28/29)
export function applyDueFixedCosts(fixedCosts) {
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth();
  const todayD = today.getDate();

  const applied = [];
  const updatedFixedCosts = fixedCosts.map((fc) => {
    if (!fc.isActive) return fc;

    // ถ้า lastApplied หายไป ตั้งเป็นรอบปัจจุบันเพื่อไม่ apply ซ้ำ
    if (!fc.lastApplied) {
      const fallback = fc.frequency === 'yearly' ? String(todayY) : monthKey(todayY, todayM);
      return { ...fc, lastApplied: fallback };
    }

    const startDate = parseLocalDate(fc.startDate);
    if (startDate.getFullYear() < 100) return fc; // ปี 2 หลัก (กรอกผิด) → ข้าม
    if (today < startDate) return fc;

    if (fc.frequency === 'monthly') {
      const currentKey = monthKey(todayY, todayM);
      if (fc.lastApplied === currentKey) return fc;

      // เริ่ม backfill จากเดือน *ถัดจาก* lastApplied
      const [lastY, lastM] = fc.lastApplied.split('-').map(Number);
      let cy = lastY;
      let cm = lastM; // lastM-1+1 = lastM (เดือนถัดไปใน 0-indexed)
      // normalize เผื่อ cm = 12
      if (cm > 11) { cy += 1; cm = 0; }

      let newLastApplied = fc.lastApplied;

      while (cy < todayY || (cy === todayY && cm <= todayM)) {
        // ข้ามเดือนที่ก่อน startDate
        const isBeforeStart =
          cy < startDate.getFullYear() ||
          (cy === startDate.getFullYear() && cm < startDate.getMonth());
        if (isBeforeStart) {
          cm += 1; if (cm > 11) { cm = 0; cy += 1; }
          continue;
        }

        const lastDay = lastDayOfMonth(cy, cm);
        const scheduledDay = Math.min(fc.dayOfMonth, lastDay);
        const isCurrentMonth = (cy === todayY && cm === todayM);

        // เดือนปัจจุบัน: apply ก็ต่อเมื่อถึงวันที่กำหนดแล้ว
        if (isCurrentMonth && todayD < scheduledDay) break;

        const d = String(scheduledDay).padStart(2, '0');
        const m = String(cm + 1).padStart(2, '0');
        applied.push({
          description: fc.description,
          amount: fc.amount,
          type: fc.type,
          date: `${cy}-${m}-${d}T00:00:00.000`,
          isFixed: true,
        });
        newLastApplied = monthKey(cy, cm);

        cm += 1; if (cm > 11) { cm = 0; cy += 1; }
      }

      return { ...fc, lastApplied: newLastApplied };
    }

    if (fc.frequency === 'yearly') {
      if (fc.lastApplied === String(todayY)) return fc;

      const startM = startDate.getMonth();
      const startD = startDate.getDate();
      let cursor = parseInt(fc.lastApplied, 10) + 1;
      let newLastApplied = fc.lastApplied;

      while (cursor <= todayY) {
        if (cursor < startDate.getFullYear()) { cursor += 1; continue; }

        const isCurrentYear = cursor === todayY;
        if (isCurrentYear) {
          if (todayM < startM) break;
          if (todayM === startM && todayD < startD) break;
        }

        const lastDay = lastDayOfMonth(cursor, startM);
        const day = Math.min(startD, lastDay);
        const m = String(startM + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        applied.push({
          description: fc.description,
          amount: fc.amount,
          type: fc.type,
          date: `${cursor}-${m}-${d}T00:00:00.000`,
          isFixed: true,
        });
        newLastApplied = String(cursor);
        cursor += 1;
      }

      return { ...fc, lastApplied: newLastApplied };
    }

    return fc;
  });

  persist(updatedFixedCosts);
  return { applied, updatedFixedCosts };
}
