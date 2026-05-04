import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { loadTransactions, addTransactionsBatch } from './transactionService';
const STORAGE_KEY = 'transactions';
export function exportExcelFromLocalStorage_v1(fileName = 'data.xlsx') {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(data) || data.length === 0) {
        alert('No data to export.');
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
}

export function exportExcelFromLocalStorage(fileNamePrefix = 'data') {
    // เอา raw JSON string มา
    const rawJson = localStorage.getItem(STORAGE_KEY);
    const data = rawJson ? JSON.parse(rawJson) : [];

    if (data.length === 0) {
        Swal.fire('No data to export.');
        return;
    }

    // ชื่อไฟล์ตามเดิม
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const fileName =
        `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_` +
        `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}_` +
        `${fileNamePrefix}.xlsx`;

    // สร้าง sheet แรกจาก parsed JSON
    const worksheet1 = XLSX.utils.json_to_sheet(data);

    // สร้าง sheet สองจาก raw JSON
    // ทางเลือก A: แปะทั้งก้อนใน cell A1
    const worksheet2 = XLSX.utils.aoa_to_sheet([[rawJson]]);

    // *** ถ้าอยากแยกบรรทัดให้ดูอ่านง่าย ให้ใช้แบบนี้แทน ***
    //  const lines = rawJson.split('\n');
    //  const worksheet2 = XLSX.utils.aoa_to_sheet(
    //    [['rawJson']], 
    //    lines.map(line => [line])
    //  );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet1, 'data');
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'jsonData');

    XLSX.writeFile(workbook, fileName);
}


/**
 * Import transactions from an Excel file (.xlsx).
 * Tries sheet "jsonData" (raw JSON in A1) first, then falls back to sheet "data".
 * Returns { count, mode } where mode is "json" | "sheet".
 */
export function importExcelToLocalStorage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        let imported = [];
        let mode = 'sheet';

        // Strategy 1: read raw JSON from "jsonData" sheet
        const jsonSheet = workbook.Sheets['jsonData'];
        if (jsonSheet) {
          const raw = jsonSheet['A1']?.v;
          if (raw && typeof raw === 'string') {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed) && parsed.length > 0) {
                imported = parsed;
                mode = 'json';
              }
            } catch { /* fall through to sheet strategy */ }
          }
        }

        // Strategy 2: read from "data" sheet (or first sheet)
        if (imported.length === 0) {
          const sheetName = workbook.SheetNames.includes('data')
            ? 'data'
            : workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) {
            reject(new Error('No readable sheet found'));
            return;
          }
          const rows = XLSX.utils.sheet_to_json(sheet);
          if (!rows || rows.length === 0) {
            reject(new Error('No data found in file'));
            return;
          }
          imported = rows;
          mode = 'sheet';
        }

        // Validate & normalize each row
        const valid = imported
          .filter((row) => row.description && row.amount != null && row.type)
          .map((row) => ({
            description: String(row.description).trim(),
            amount: Number(row.amount),
            type: row.type === 'income' ? 'income' : 'expense',
            date: row.date || new Date().toLocaleDateString('en-CA') + 'T00:00:00.000',
          }));

        if (valid.length === 0) {
          reject(new Error('No valid transactions found'));
          return;
        }

        // Merge into existing data
        const existing = loadTransactions();
        addTransactionsBatch(valid, existing);

        resolve({ count: valid.length, mode });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
