'use client';

/**
 * List of transactions with edit/delete actions
 */
export default function TransactionList({ items, onEdit, onDelete }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">รายการทั้งหมด</h2>
        </div>
        <div>
          <i className="fa fa-id-card" aria-hidden="true"></i>
        </div>
      </div>
      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">รายละเอียด</th>
            <th className="p-2 text-left">ประเภท</th>
            <th className="p-2 text-right">จำนวนเงิน</th>
            <th className="p-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {items.map(tx => (
            <tr key={tx.id} className="border-t">
              <td className="p-2">{tx.description}</td>
              <td className="p-2 capitalize">{tx.type === 'expense' ? 'รายจ่าย' : 'รายรับ'}</td>
              <td className="p-2 text-right">
                {tx.type === 'expense' ? '-' : '+'}{tx.amount.toLocaleString()}
              </td>
              <td className="p-2 text-center space-x-2 flex justify-center">
                <button onClick={() => onEdit(tx)} className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 w-50px">
                  แก้ไข
                </button>
                <button onClick={() => onDelete(tx.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-50px">
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}