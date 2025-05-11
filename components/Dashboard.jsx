'use client';

/**
 * Dashboard component shows income, expense, and balance
 * Now accepts transactions as a prop to update dynamically
 */
export default function Dashboard({ transactions }) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-green-100 rounded shadow">
        <h3 className="text-lg font-medium">รายรับทั้งหมด</h3>
        <p className="text-2xl font-bold text-green-700">{income.toLocaleString()}</p>
      </div>
      <div className="p-4 bg-red-100 rounded shadow">
        <h3 className="text-lg font-medium">รายจ่ายทั้งหมด</h3>
        <p className="text-2xl font-bold text-red-700">{expense.toLocaleString()}</p>
      </div>
      <div className="p-4 bg-blue-100 rounded shadow">
        <h3 className="text-lg font-medium">ยอดคงเหลือ</h3>
        <p className="text-2xl font-bold text-blue-700">{balance.toLocaleString()}</p>
      </div>
    </div>
  );
}