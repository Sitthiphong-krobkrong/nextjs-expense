'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
/**
 * Form to add or edit a transaction
 */
export default function TransactionForm({ onSave, editing, onCancel }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  useEffect(() => {
    if (editing) {
      setDescription(editing.description);
      setAmount(String(editing.amount));
      setType(editing.type);
    }
  }, [editing]);

  async function handleSubmit(e) {

    e.preventDefault();
    const result = await Swal.fire({
      title: 'ยืนยันการบันทึกรายการ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, บันทึก',
      cancelButtonText: 'ยกเลิก',
    });

    if (!result.isConfirmed) return;

    // Validation
    if (!description.trim()) {
      await Swal.fire({
        icon: 'error',
        title: 'กรุณากรอกรายละเอียด',
        confirmButtonText: 'ตกลง',
      });
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      await Swal.fire({
        icon: 'error',
        title: 'จำนวนเงินต้องเป็นตัวเลขมากกว่า 0',
        confirmButtonText: 'ตกลง',
      });
      return;
    }
    if (type !== 'income' && type !== 'expense') {
      await Swal.fire({
        icon: 'error',
        title: 'ประเภทไม่ถูกต้อง',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    const tx = {
      id: editing ? editing.id : Date.now(),
      description,
      amount: parsedAmount,
      type,
      date: new Date().toISOString(),
    };
    onSave(tx);
    setDescription('');
    setAmount('');
    setType('expense');

    await Swal.fire({
      icon: 'success',
      title: 'บันทึกรายการเรียบร้อย',
      confirmButtonText: 'ตกลง',
    });


  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span>
          {editing ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7l-1.5-1.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </span>
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
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center gap-2">
          {editing ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              บันทึก
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              เพิ่ม
            </>
          )}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
