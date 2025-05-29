import * as XLSX from 'xlsx';
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
        alert('No data to export.');
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
