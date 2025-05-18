'use client';
import { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';



// You can use any chart library, here is an example with 'react-chartjs-2'

Chart.register(ArcElement, Tooltip, Legend);

/**
 * Dashboard component shows income, expense, and balance
 * Now accepts transactions as a prop to update dynamically
 * Also displays a pie chart of income vs expense
 */
export default function Dashboard({ transactions }) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  // Prepare data for Pie chart
  const pieData = useMemo(() => ({
    labels: ['รายรับ', 'รายจ่าย', 'ยอดคงเหลือ'],
    datasets: [
      {
        data: [income, expense,balance],
        backgroundColor: ['#4ade80', '#f87171', '#3b82f6'],
        hoverBackgroundColor: ['#4ade80', '#f87171', '#3b82f6'],
        borderWidth: 1,
      },
    ],
  }), [income, expense]);

  return (
    <>
      <div className="mb-6 flex justify-center font-kanit">
        <div className="w-64 h-64 font-bold">
          <Pie
            data={pieData}
            options={{
              plugins: {
                legend: {
                  labels: {
                    font: {
                      family: 'Kanit, sans-serif',
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-kanit">
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
    </>
  );
}