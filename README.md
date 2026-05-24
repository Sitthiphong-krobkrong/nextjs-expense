# nextjs-expense

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://nextjs-expense-bay.vercel.app)

แอปพลิเคชันบันทึกรายรับ-รายจ่ายส่วนตัว สร้างด้วย **Next.js 15 + React 19 + Tailwind CSS 4**
ข้อมูลทั้งหมดเก็บใน localStorage ของเบราว์เซอร์ ไม่ต้องใช้ฐานข้อมูล
Deploy เป็น Static Site ผ่าน **Vercel**

**Live Demo**: https://nextjs-expense-bay.vercel.app

---

## Table of Contents

- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Voice Input](#voice-input)
- [Import / Export Excel](#import--export-excel)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Browser Support](#browser-support)
- [Data Storage & Backup](#data-storage--backup)
- [FAQ / Troubleshooting](#faq--troubleshooting)
- [Roadmap](#roadmap)
- [License](#license)

---

## Screenshots

> _เพิ่มภาพหน้าจอที่นี่ (Dashboard, Calendar, Add page, Dark mode)_
>
> วางไฟล์ภาพไว้ที่ `docs/screenshots/` แล้วใส่ตามตัวอย่าง:
>
> ```markdown
> ![Dashboard](docs/screenshots/dashboard.png)
> ![Calendar](docs/screenshots/calendar.png)
> ```

---

## Tech Stack

| เทคโนโลยี | เวอร์ชัน | หมายเหตุ |
|-----------|---------|----------|
| Next.js | 15 | App Router + Turbopack + Static Export |
| React | 19 | |
| TypeScript | 5 | (ผสมกับ JSX — ดู [Project Structure](#project-structure)) |
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
- **Toggle มุมมอง Dashboard** — สลับดู "ทั้งหมด" หรือ "เดือนนี้" ได้ทันที
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

## Getting Started

### Prerequisites

- **Node.js** 20+ (แนะนำ LTS)
- **npm** 10+ หรือ pnpm/yarn

### Installation

```bash
git clone https://github.com/Sitthiphong-krobkrong/nextjs-expense.git
cd nextjs-expense
npm install
npm run dev
```

เปิด http://localhost:3000

### Available Scripts

| คำสั่ง | หน้าที่ |
|--------|--------|
| `npm run dev` | รัน dev server (Turbopack) |
| `npm run build` | Build production → static export ออกไปที่ `out/` |
| `npm run start` | รัน production server (ปกติไม่ต้องใช้ เพราะ deploy เป็น static) |
| `npm run lint` | ตรวจสอบ code style ด้วย ESLint |
| `npm run deploy` | Build แล้ว push `out/` ไปยัง GitHub Pages |

> โปรเจกต์ตั้งค่า `output: 'export'` ใน `next.config.ts` ดังนั้น `npm run build` จะสร้างไฟล์ static ใน `out/` พร้อม deploy ขึ้น Vercel / GitHub Pages / Netlify ได้ทันที

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

> **หมายเหตุ**: โปรเจกต์มีทั้งไฟล์ `.tsx` และ `.jsx` ปนกัน — ส่วนที่เป็น infrastructure (hooks, providers, i18n) ใช้ TypeScript ส่วน UI components และ pages บางส่วนยังเป็น JSX การ migrate ทั้งหมดเป็น TS อยู่ใน [Roadmap](#roadmap)

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

## Browser Support

| Browser | App หลัก | Voice Input |
|---------|---------|-------------|
| Chrome (Desktop / Android) | ✅ | ✅ |
| Edge | ✅ | ✅ |
| Safari (macOS / iOS) | ✅ | ✅ |
| Firefox | ✅ | ❌ (ไม่รองรับ Web Speech API) |

> สำหรับการใช้งานทั่วไปรองรับทุก modern browser แต่ฟีเจอร์ **Voice Input** จะใช้ได้เฉพาะ browser ที่รองรับ Web Speech API เท่านั้น

---

## Data Storage & Backup

⚠️ **ข้อมูลทั้งหมดเก็บใน localStorage ของเบราว์เซอร์** ซึ่งหมายความว่า:

- ข้อมูลจะ**หายทันที**หาก clear browser data / cookies
- **ไม่ sync ข้ามเครื่อง** หรือข้ามเบราว์เซอร์
- เปลี่ยน browser / โหมด incognito จะมองไม่เห็นข้อมูลเดิม
- localStorage มี quota จำกัด (~5-10MB ต่อ origin)

**แนะนำ**: Export Excel เป็นระยะ (ทุกสัปดาห์/เดือน) ผ่านหน้า `/manage` เพื่อ backup ข้อมูล หากเปลี่ยนเครื่องค่อย Import กลับ

---

## FAQ / Troubleshooting

<details>
<summary><strong>Voice Input ไม่ทำงาน / กดปุ่มไมโครโฟนแล้วไม่มีอะไรเกิดขึ้น</strong></summary>

- เช็กว่าใช้ Chrome / Edge / Safari (Firefox ไม่รองรับ)
- อนุญาตให้เว็บเข้าถึงไมโครโฟน (ดูที่ address bar)
- ต้องเข้าผ่าน HTTPS หรือ `localhost` เท่านั้น (Web Speech API ไม่ทำงานบน HTTP)
</details>

<details>
<summary><strong>ข้อมูลหายไปหมดเลย!</strong></summary>

- เช็กว่า clear browser data หรือเปลี่ยนเบราว์เซอร์หรือเปล่า
- เช็กว่าเข้าใช้งานจาก URL เดิมหรือไม่ (localStorage แยกตาม origin)
- หากเคย Export Excel ไว้ ให้นำเข้าผ่านหน้า `/manage` → Import
- ครั้งหน้าแนะนำ Export Excel เป็นระยะ (ดู [Data Storage & Backup](#data-storage--backup))
</details>

<details>
<summary><strong>ค่าใช้จ่ายประจำไม่ auto apply</strong></summary>

- ระบบจะ apply ตอนเปิดแอปและถึงวันที่กำหนด
- ลองเข้าหน้าใดหน้าหนึ่งใหม่เพื่อ trigger การเช็ก
- เช็กว่าตั้งวันที่เริ่มต้น (start date) ถูกต้องหรือไม่
</details>

<details>
<summary><strong>Deploy ขึ้น Vercel / GitHub Pages แล้วหน้าเปล่า</strong></summary>

- หาก deploy ใน sub-path (เช่น GitHub Pages) ต้องเปิด `basePath` และ `assetPrefix` ใน `next.config.ts`
- Vercel ที่ root domain ใช้ default config ได้เลย
</details>

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
- [ ] Migrate JSX ทั้งหมดเป็น TypeScript

---

## License

[MIT](LICENSE) © Sitthiphong Krobkrong
