# nextjs-expense

แอปพลิเคชันบันทึกรายรับ-รายจ่ายส่วนตัว สร้างด้วย **Next.js 15 + React 19 + Tailwind CSS 4**
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
| Chart.js / react-chartjs-2 | 5 | Doughnut + Bar chart |
| SweetAlert2 | 11 | Confirmation dialogs |
| XLSX | 0.18 | Import / Export ข้อมูลเป็น Excel |
| next-themes | 0.4 | Dark / Light mode |
| Web Speech API | built-in | Voice input (ไม่ต้องติดตั้ง) |

---

## Features

- เพิ่ม / แก้ไข / ลบ รายรับและรายจ่าย พร้อมเลือกวันที่ย้อนหลังได้
- **หน้าเพิ่ม/แก้ไขรายการแยกต่างหาก** (`/add`) — รองรับทั้งเพิ่มใหม่และแก้ไขรายการเดิม
- Dashboard: Doughnut chart สรุปภาพรวม + Bar chart รายรับ-รายจ่ายย้อนหลัง 6 เดือน
- ซ่อน/แสดงยอดเงินใน stat cards (Privacy toggle)
- ปฏิทินการเงิน (Calendar) — ดูรายวันและรายสัปดาห์ พร้อม heatmap และ expand รายการ
- **ค่าใช้จ่ายประจำ (Fixed Costs)** — ตั้งรายการรายเดือน/รายปี ระบบจะ auto apply เมื่อถึงกำหนด
- Bottom navigation bar สำหรับ mobile
- ตารางรายการ แบ่งหน้า 10 รายการต่อหน้า (เรียงตามวันที่ล่าสุดก่อน)
- **Import / Export Excel** — นำเข้าและส่งออกข้อมูลเป็นไฟล์ .xlsx
- ลบข้อมูลทั้งหมดพร้อม Confirmation dialog
- Voice Input — พูดเพื่อบันทึกรายการผ่าน Web Speech API
- รองรับ 2 ภาษา: ไทย / English (สลับได้ทันที, จำค่าไว้ใน localStorage)
- Dark / Light mode (ธีมสีเขียว Emerald)
- Responsive — รองรับมือถือและ desktop
- ข้อมูลเก็บใน localStorage (Client-side, ไม่ต้องมี Backend)

---

## Voice Input

กดปุ่มไมโครโฟนในฟอร์มเพิ่มรายการ แล้วพูดภาษาไทย ระบบจะแยก **รายละเอียด**, **จำนวนเงิน** และ **ประเภท** ให้อัตโนมัติ

| พูดว่า | รายละเอียด | จำนวนเงิน | ประเภท |
|--------|-----------|-----------|--------|
| "กินข้าว 50 บาท" | กินข้าว | 50 | รายจ่าย |
| "เงินเดือน 30000" | - | 30,000 | รายรับ |
| "ค่ารถ 200 บาท" | ค่ารถ | 200 | รายจ่าย |
| "โบนัส 5000 บาท" | - | 5,000 | รายรับ |

> รองรับ Chrome, Edge, Safari — ใช้ Web Speech API built-in ไม่ต้องติดตั้ง library เพิ่ม

---

## Import / Export Excel

- **Export** — ส่งออกข้อมูลทั้งหมดเป็นไฟล์ .xlsx (มี 2 sheets: `data` แบบตาราง + `jsonData` แบบ raw JSON)
- **Import** — นำเข้าจากไฟล์ .xlsx ที่เคย export ออกไป ข้อมูลจะถูก merge เข้ากับข้อมูลเดิม (ไม่ลบของเก่า)
- รองรับทั้งการอ่านจาก sheet `jsonData` (ข้อมูลครบถ้วน) และ sheet `data` (fallback)

---

## Project Structure

```
nextjs-expense/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── hooks/
│   │   ├── useLanguage.ts          # i18n hook (TH/EN)
│   │   ├── useLocalStorageState.ts
│   │   └── useSpeechRecognition.ts
│   ├── add/page.jsx                # หน้าเพิ่ม/แก้ไขรายการ + ค่าใช้จ่ายประจำ
│   ├── transaction/page.jsx        # หน้าหลัก (Dashboard + รายการ)
│   ├── calendar/page.jsx           # ปฏิทินการเงิน
│   ├── manage/page.jsx             # จัดการข้อมูล (Import/Export/ลบ)
│   └── about/page.jsx
├── components/
│   ├── Dashboard.jsx               # Doughnut + Bar chart + stat cards
│   ├── ExpenseCalendar.jsx         # ปฏิทินรายวัน/รายสัปดาห์
│   ├── FixedCostManager.jsx        # จัดการค่าใช้จ่ายประจำ
│   ├── TransactionForm.jsx         # ฟอร์มเพิ่ม/แก้ไข + voice input
│   ├── TransactionList.jsx         # ตารางรายการ + pagination
│   ├── BottomNav.tsx               # Bottom navigation (mobile)
│   ├── Navbar.tsx
│   ├── LangProvider.tsx            # i18n context provider
│   ├── Footer.tsx
│   ├── ThemeProvider.tsx
│   ├── ThemeToggle.tsx
│   └── DelayedLoader.tsx
├── services/
│   ├── transactionService.js       # CRUD + batch import
│   ├── fixedCostService.js         # CRUD + auto-apply ค่าใช้จ่ายประจำ
│   └── manageService.js            # Import / Export Excel
├── lib/
│   ├── i18n.ts                     # Translation strings (TH/EN)
│   └── version.ts
└── package.json
```

---

## Getting Started

```bash
npm install
npm run dev
```

เปิด http://localhost:3000

```bash
npm run build   # build production
```

---

## Routes

| Route | หน้า |
|-------|------|
| `/` | ภาพรวมการเงิน + Dashboard + รายการ |
| `/add` | เพิ่ม/แก้ไขรายการ + ค่าใช้จ่ายประจำ (รองรับ `?edit=id`) |
| `/calendar` | ปฏิทินการเงิน |
| `/manage` | จัดการข้อมูล / Import / Export Excel |
| `/about` | เกี่ยวกับแอป |


---

## Roadmap

Feature ที่วางแผนจะเพิ่มในอนาคต:

- [ ] ค้นหารายการ — พิมพ์ชื่อเพื่อหารายการได้เร็วขึ้น
- [ ] กรองตามประเภท — ดูเฉพาะรายรับ หรือเฉพาะรายจ่าย
- [ ] ตั้งงบประมาณรายเดือน — ตั้งเป้าค่าใช้จ่าย พร้อม progress bar
- [ ] หมวดหมู่ (Category) — เช่น อาหาร, เดินทาง, ที่พัก พร้อม breakdown chart
- [ ] PWA (Progressive Web App) — ติดตั้งเป็นแอปบนมือถือ ใช้ offline ได้
- [ ] Backup/Restore ผ่าน QR Code หรือ Link — ย้ายข้อมูลข้ามเครื่องโดยไม่ต้องมี server
- [ ] Import จาก CSV
