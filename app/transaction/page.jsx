"use client";
import { useState, useEffect } from "react";
import {
  loadTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../services/transactionService";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import Dashboard from "../../components/Dashboard";
import Swal from "sweetalert2";

export default function TransactionsPage() {
  // โหลดครั้งเดียวตอน mount
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const [editingTx, setEditingTx] = useState(null);

  const handleSave = (tx) => {
    const updated = editingTx
      ? updateTransaction(tx, transactions)
      : addTransaction(tx, transactions);
    setTransactions(updated);
    setEditingTx(null);
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการลบรายการ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบ",
      cancelButtonText: "ยกเลิก",
    });
    if (!isConfirmed) return;
    const updated = deleteTransaction(id, transactions);
    setTransactions(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          รายรับ-รายจ่าย
        </h1>
        <Dashboard transactions={transactions} />
        <TransactionForm
          key={editingTx ? editingTx.id : "new"}
          onSave={handleSave}
          editing={editingTx}
          onCancel={() => setEditingTx(null)}
        />
        <TransactionList
          items={transactions}
          onEdit={(tx) => setEditingTx(tx)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
