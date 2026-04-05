"use client";
import { useState } from "react";
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
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });
    if (!isConfirmed) return;
    const updated = deleteTransaction(id, transactions);
    setTransactions(updated);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{
            background: "linear-gradient(135deg, #0e7490, #0f4c75)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            รายรับ-รายจ่าย
          </h1>
          <p className="text-gray-500 text-sm">ติดตามการเงินของคุณได้ง่ายๆ</p>
        </div>

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
