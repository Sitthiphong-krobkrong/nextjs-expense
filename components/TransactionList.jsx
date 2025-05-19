import { useState } from "react";

// 'use client';

/**
 * List of transactions with edit/delete actions
 */


export default function TransactionList({ items, onEdit, onDelete }) {
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  // Sort items by create_date descending before paginating
  const sortedItems = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
  const pagedItems = sortedItems.slice(
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
          {/* /* id-card icon */}
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" fill="none" />
            <circle cx="9" cy="12" r="3" stroke="currentColor" fill="none" />
            <path d="M15 11h2M15 15h2" stroke="currentColor" />
          </svg>
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
                    className="p-2 bg-yellow-400 rounded hover:bg-yellow-500 flex items-center justify-center"
                    aria-label="แก้ไข"
                  >
                    {/* pencil icon */}
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
                      <path d="M7 17h2a2 2 0 002-2v-2" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                    aria-label="ลบ"
                  >
                    {/* trash icon */}
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
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
      <div className="flex flex-wrap justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center justify-center"
          aria-label="ก่อนหน้า"
        >
          {/* chevron-left icon */}
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          </button>
          <div className="flex flex-wrap gap-1 max-w-full overflow-x-auto">
            {(() => {
              // Pagination group logic: show 5 page numbers at a time
              const groupSize = 5;
              const currentGroup = Math.floor((currentPage - 1) / groupSize);
              const start = currentGroup * groupSize + 1;
              const end = Math.min(start + groupSize - 1, totalPages);
              const pageNumbers = [];
              for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
              }
              return (
                <>
                  {start > 1 && (
                    <button
                      onClick={() => setCurrentPage(start - 1)}
                      className="px-2 py-1 rounded bg-gray-100 text-gray-500"
                      aria-label="Previous group"
                    >
                      &lt;
                    </button>
                  )}
                  {pageNumbers.map(i => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-1 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      {i}
                    </button>
                  ))}
                  {end < totalPages && (
                    <button
                      onClick={() => setCurrentPage(end + 1)}
                      className="px-2 py-1 rounded bg-gray-100 text-gray-500"
                      aria-label="Next group"
                    >
                      &gt;
                    </button>
                  )}
                </>
              );
            })()}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center justify-center"
            aria-label="ถัดไป"
          >
            {/* chevron-right icon */}
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}