'use client';
import { useState, useEffect } from 'react';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  saveTransactions,
} from '../../services/transactionService';
import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';
import Dashboard from '../../components/Dashboard';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [editingTx, setEditingTx] = useState(null);

  // Load transactions on mount
  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  // Save whenever transactions change
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const handleSave = tx => {
    if (editingTx) {
      updateTransaction(tx);
    } else {
      addTransaction(tx);
    }
    setTransactions(getTransactions());
    setEditingTx(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">รายรับ-รายจ่าย</h1>
        <Dashboard transactions={transactions} />
        <TransactionForm onSave={handleSave} editing={editingTx} onCancel={() => setEditingTx(null)} />
        <TransactionList
          items={transactions}
          onEdit={tx => setEditingTx(tx)}
          onDelete={id => {
            deleteTransaction(id);
            setTransactions(getTransactions());
          }}
        />
      </div>
    </div>
  );
}
