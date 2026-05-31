const KEY = "budgets";

export function loadBudgets() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

export function saveBudgets(budgets) {
  localStorage.setItem(KEY, JSON.stringify(budgets));
}

export function setBudget(categoryId, amount) {
  const b = loadBudgets();
  if (!amount || amount <= 0) { delete b[categoryId]; }
  else { b[categoryId] = Number(amount); }
  saveBudgets(b);
  return b;
}
