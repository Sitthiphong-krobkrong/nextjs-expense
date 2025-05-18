import { useState } from "react";

// 'use client';

/**
 * List of transactions with edit/delete actions
 */


export default function TransactionList({ items, onEdit, onDelete }) {
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pagedItems = items.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="mt-6 mb-30 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            รายการทั้งหมด <span className="text-sm text-gray-500"># = {items.length}</span>
          </h2>
        </div>
        <div>
          <i className="fa fa-id-card" aria-hidden="true"></i>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">จัดการ</th>
              <th className="p-2 text-left">วันที่</th>
              <th className="p-2 text-left">รายละเอียด</th>
              <th className="p-2 text-left">ประเภท</th>
              <th className="p-2 text-right">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {pagedItems.map(tx => (
              <tr key={tx.id} className="border-t">
                <td className="p-2 text-center space-x-2 flex justify-center">
                  <button
                    onClick={() => onEdit(tx)}
                    className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 w-50px flex items-center space-x-1"
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                    <span>แก้ไข</span>
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-50px flex items-center space-x-1"
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                    <span>ลบ</span>
                  </button>
                </td>
                <td className="p-2 text-left">
                  {tx.date ? new Date(tx.date).toLocaleDateString('th-TH') : '-'}
                </td>
                <td className="p-2">{tx.description}</td>
                <td className="p-2 capitalize">
                  <span className={tx.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                    {tx.type === 'expense' ? 'รายจ่าย' : 'รายรับ'}
                  </span>
                </td>
                <td className={`p-2 text-right font-semibold ${tx.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  {tx.type === 'expense' ? '-' : '+'}{tx.amount.toLocaleString()}
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ก่อนหน้า
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}