// Service layer: manage transaction data in localStorage
const STORAGE_KEY = 'transactions';

export function getTransactions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function addTransaction(tx) {
  const transactions = getTransactions();
  transactions.push(tx);
  saveTransactions(transactions);
}

export function updateTransaction(updatedTx) {
  const transactions = getTransactions().map(tx =>
    tx.id === updatedTx.id ? updatedTx : tx
  );
  saveTransactions(transactions);
}

export function deleteTransaction(id) {
  const transactions = getTransactions().filter(tx => tx.id !== id);
  saveTransactions(transactions);
}

export function deleteAllTransactions() {
  localStorage.removeItem(STORAGE_KEY);
}