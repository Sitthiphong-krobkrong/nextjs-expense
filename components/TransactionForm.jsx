'use client';
import { useState, useEffect } from 'react';
/**
 * Form to add or edit a transaction
 */
export default function TransactionForm({ onSave, editing, onCancel }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => {
    if (editing) {
      setDescription(editing.description);
      setAmount(String(editing.amount));
      setType(editing.type);
    }
  }, [editing]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description || !amount) return;
    const tx = {
      id: editing ? editing.id : Date.now(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString(),
    };
    onSave(tx);
    setDescription('');
    setAmount('');
    setType('income');
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">
        {editing ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
      </h2>
      <div>
        <label className="block text-sm">รายละเอียด</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm">จำนวนเงิน</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm">ประเภท</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
          {editing ? (
            <>
              {/* <i className="fa fa-save mr-2" /> */}
              บันทึก
            </>
          ) : (
            <>
              {/* <i className="fa fa-plus mr-2" /> */}
              เพิ่ม
            </>
          )}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
