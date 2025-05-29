// services/transactionService.ts
const STORAGE_KEY = 'transactions';

// โหลดจาก storage
export function loadTransactions() {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// เก็บลง storage
function persist(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// เพิ่มรายการ (assign id ให้ในนี้เลย)
export function addTransaction(tx, list) {
  const txWithId = { ...tx, id: Date.now() };
  const updated = [...list, txWithId];
  persist(updated);
  return updated;
}

// อัปเดตรายการ
export function updateTransaction(tx, list) {
  const updated = list.map((t) => (t.id === tx.id ? tx : t));
  persist(updated);
  return updated;
}

// ลบรายการ
export function deleteTransaction(id, list) {
  const updated = list.filter((t) => t.id !== id);
  persist(updated);
  return updated;
}

// ลบทั้งหมด
export function deleteAllTransactions() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}
