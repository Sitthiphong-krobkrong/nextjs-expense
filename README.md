# nextjs-expense

แอปพลิเคชันบันทึกรายรับ-รายจ่ายส่วนตัว สร้างด้วย **Next.js 15 + React 19 + Tailwind CSS 4**
แสดงข้อมูลยอดรวมรายรับ รายจ่าย และยอดคงเหลือแบบเรียลไทม์ พร้อม Dashboard กราฟวงกลม
ข้อมูลทั้งหมดเก็บใน localStorage ของเบราว์เซอร์ ไม่ต้องใช้ฐานข้อมูล
Deploy เป็น Static Site ผ่าน **Vercel**

**Live Demo**: https://nextjs-expense-bay.vercel.app

---

## Tech Stack

| เทคโนโลยี | เวอร์ชัน | หมายเหตุ |
|-----------|---------|----------|
| Next.js | 15 | App Router + Turbopack + Static Export |
| React | 19 | |
| Tailwind CSS | 4 | |
| Chart.js | via react-chartjs-2 | กราฟวงกลมใน Dashboard |
| SweetAlert2 | 11 | Confirmation dialogs |
| XLSX | 0.18 | Export ข้อมูลเป็น Excel |
| Font Awesome | 4.7 | Icons |
| Web Speech API | built-in | พูดเพื่อบันทึกรายการ (ไม่ต้องติดตั้ง) |

---

## Features

- เพิ่ม / แก้ไข / ลบ รายรับและรายจ่าย
- Dashboard แสดงยอดรวมรายรับ / รายจ่าย / คงเหลือ พร้อมกราฟวงกลม
- ซ่อน/แสดงยอดเงินใน Dashboard (Privacy toggle)
- ตารางรายการ แบ่งหน้า (Pagination) 5 รายการต่อหน้า
- Export ข้อมูลเป็นไฟล์ Excel (.xlsx)
- ลบข้อมูลทั้งหมดพร้อม Confirmation dialog
- พูดเพื่อบันทึกรายการ (Voice Input) รองรับภาษาไทย ผ่าน Web Speech API
- UI Responsive รองรับมือถือ
- ข้อมูลเก็บใน localStorage (Client-side, ไม่ต้องมี Backend)

---

## Voice Input (พูดเพื่อบันทึก)

กดปุ่มไมโครโฟนในฟอร์มเพิ่มรายการ แล้วพูดภาษาไทย ระบบจะแยก **รายละเอียด**, **จำนวนเงิน** และ **ประเภท** ให้อัตโนมัติ

| พูดว่า | รายละเอียด | จำนวนเงิน | ประเภท |
|--------|-----------|-----------|--------|
| "กินข้าว 50 บาท" | กินข้าว | 50 | รายจ่าย |
| "เงินเดือน 30000" | - | 30,000 | รายรับ |
| "ค่ารถ 200 บาท" | ค่ารถ | 200 | รายจ่าย |
| "โบนัส 5000 บาท" | - | 5,000 | รายรับ |
| "รายรับ ขายของ 1500" | ขายของ | 1,500 | รายรับ |
| "แฟนให้ 1500" | ให้ | 1,500 | รายรับ |

**หลักการแยกประเภท:** หากคำพูดมี keyword เช่น `รายรับ`, `เงินเดือน`, `โบนัส`, `ค่าจ้าง`, `ขายของ` , `ให้` ระบบจะถือเป็น **รายรับ** นอกนั้น default เป็น **รายจ่าย**

> ใช้ Web Speech API (built-in ในเบราว์เซอร์) ไม่ต้องติดตั้ง library เพิ่ม รองรับ Chrome, Edge, Safari

---

## Project Structure

```
nextjs-expense/
├── app/
│   ├── layout.tsx                  # Root layout (Navbar + Footer + Font)
│   ├── page.tsx                    # หน้าแรก
│   ├── globals.css                 # Global styles
│   ├── hooks/
│   │   ├── useLocalStorageState.ts # Custom hook สำหรับ sync state กับ localStorage
│   │   └── useSpeechRecognition.ts # Custom hook สำหรับ Voice Input (Web Speech API)
│   ├── transaction/
│   │   └── page.jsx               # หน้าหลัก - จัดการรายรับรายจ่าย
│   ├── manage/
│   │   └── page.jsx               # จัดการข้อมูล - ลบทั้งหมด / Export Excel
│   └── about/
│       └── page.jsx               # เกี่ยวกับแอป
├── components/
│   ├── Dashboard.jsx               # สรุปยอดเงิน + กราฟวงกลม
│   ├── TransactionForm.jsx         # ฟอร์มเพิ่ม/แก้ไขรายการ
│   ├── TransactionList.jsx         # ตารางรายการ + Pagination
│   ├── Navbar.tsx                  # แถบนำทาง (Responsive)
│   ├── Footer.tsx                  # Footer แสดงเวอร์ชัน
│   └── DelayedLoader.tsx           # Loading spinner ระหว่างเปลี่ยนหน้า
├── services/
│   ├── transactionService.js       # CRUD รายการ (localStorage)
│   └── manageService.js            # Export Excel
├── lib/
│   └── version.ts                  # App version
├── public/                         # Static assets (SVG icons)
├── next.config.ts                  # Static export + trailing slash
├── tsconfig.json
├── postcss.config.mjs
└── package.json
```

---

## Getting Started

```bash
# ติดตั้ง Dependencies
npm install

# รัน Development Server (Turbopack)
npm run dev

# Build สำหรับ Production
npm run build

# รัน Production Server
npm run start
```

เปิด http://localhost:3000 เพื่อใช้งาน

---

## Routes

| Route | หน้า | รายละเอียด |
|-------|------|-----------|
| `/` | Home | หน้าแรก (แสดง Transaction) |
| `/transaction` | Transaction | จัดการรายรับรายจ่าย + Dashboard |
| `/manage` | Manage | ลบข้อมูลทั้งหมด / Export Excel |
| `/about` | About | เกี่ยวกับแอปพลิเคชัน |

---

## Deploy

แอปถูกตั้งค่าเป็น Static Export (`output: 'export'` ใน `next.config.ts`)
สามารถ Deploy ได้บน Vercel, GitHub Pages หรือ Static Hosting อื่น ๆ

```bash
npm run build
```

ไฟล์ที่ build แล้วจะอยู่ในโฟลเดอร์ `out/`
