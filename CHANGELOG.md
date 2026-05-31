# Changelog

## Unreleased — Debug & Improvement Session (2026-05-31)

---

### 🔴 Bug Fixes

#### B1. Fixed Cost — duplicate transactions (stale state)
| | |
|---|---|
| **root cause** | `FixedCostManager` โหลด state ก่อน `FixedCostApplier.useEffect` รัน → state มี `lastApplied` เก่า → `handleSave` เขียนทับ localStorage → `applyDueFixedCosts` apply ซ้ำ |
| **แก้** | `handleSave`/`handleDelete`/`toggle` ใช้ `loadFixedCosts()` สดจาก localStorage แทน stale state + เพิ่ม `transactions-updated` listener sync state |

#### B2. Fixed Cost — ไม่ apply เมื่อถึงวันกำหนด (same session)
| | |
|---|---|
| **root cause** | `FixedCostApplier` ใช้ `ranOnce.current` → ทำงานครั้งเดียวต่อ session → ถ้าเปิดค้างข้ามวัน ไม่ re-check |
| **แก้** | เปลี่ยนเป็น `checkedDateRef` เก็บวันที่ล่าสุด + เพิ่ม `usePathname` เป็น dependency → re-check ทุก navigation |

#### B3. appliedThisMonth ใช้ UTC แทน local time
| | |
|---|---|
| **root cause** | `new Date().toISOString().substring(0,7)` คืน UTC → ใกล้เที่ยงคืน badge แสดงผิดเดือน |
| **แก้** | คำนวณ local month key เหมือนกับที่ `monthKey()` ใช้ใน service |

#### B4. EMPTY_FORM.startDate คำนวณตอน module โหลด
| | |
|---|---|
| **root cause** | `new Date().toISOString()` รันครั้งเดียวตอน module load → ถ้าเปิดค้างข้ามคืน startDate default เป็นเมื่อวาน |
| **แก้** | `openAdd()` และ `handleCancel()` เรียก `freshEmptyForm()` ที่คำนวณวันที่ใหม่ทุกครั้ง |

#### B5. Fixed cost transactions ไม่มี category
| | |
|---|---|
| **root cause** | `applyDueFixedCosts` ไม่ pass `category` ไปกับ transaction ที่ apply → แสดงเป็น "อื่นๆ" ทั้งหมด |
| **แก้** | ส่ง `category: fc.category \|\| fallback` ไปใน applied transactions ทั้ง monthly และ yearly |

#### B6. Pagination ไม่ reset เมื่อ filter/search เปลี่ยน
| | |
|---|---|
| **root cause** | `currentPage` ไม่ reset เมื่อ `items` เปลี่ยน → อยู่หน้า 5 แล้ว filter → เห็น empty page |
| **แก้** | `useEffect(() => setCurrentPage(1), [filteredItems])` |

#### B7. currentMonth ใน TransactionsPage ไม่อัพเดทเมื่อเดือนเปลี่ยน
| | |
|---|---|
| **root cause** | `useMemo(..., [])` คำนวณครั้งเดียว → ถ้าเปิดค้างข้ามเดือน filter ยังเป็นเดือนเก่า |
| **แก้** | เปลี่ยน deps เป็น `[transactions]` → recompute เมื่อข้อมูลอัพเดท |

#### B8. Calendar — `.sort()` mutate array โดยตรง
| | |
|---|---|
| **root cause** | `selectedDayData.items.sort(...)` แก้ไข items ใน state โดยตรง |
| **แก้** | เปลี่ยนเป็น `[...selectedDayData.items].sort(...)` |

#### B9. Calendar — selectedDay ค้างเมื่อข้ามเดือน
| | |
|---|---|
| **root cause** | `navigateMonth()` reset `selectedDay` แล้ว แต่ไม่ reset `expandedWeek` |
| **แก้** | เพิ่ม `setExpandedWeek(null)` ใน `navigateMonth()` |

#### B10. Calendar — FixedCostApplier ใน layout ไม่ refresh calendar
| | |
|---|---|
| **root cause** | `CalendarPage` ใช้ `useState` ที่ไม่มี setter → ไม่ฟัง `transactions-updated` |
| **แก้** | เพิ่ม `useEffect` listener เหมือน TransactionsPage |

---

### 🟡 UX Improvements

#### U1. Dashboard stat cards label เปลี่ยนตาม viewMode
- "เดือนนี้" → รายรับเดือนนี้ / รายจ่ายเดือนนี้ / คงเหลือเดือนนี้
- "ทั้งหมด" → รายรับทั้งหมด / รายจ่ายทั้งหมด / ยอดคงเหลือ

#### U2. TransactionForm — warning วันที่เดือนหน้า
- แสดง warning ใต้ช่องวันที่ถ้าเลือกวันในเดือนถัดไป → จะไม่แสดงใน "เดือนนี้"

#### U3. Fixed cost badge แสดงวันที่จริง
- "รอดำเนินการ" → "รอวันที่ 25" (monthly) / "รอ 1 มิ.ย." (yearly)

#### U4. Fixed cost form — เพิ่ม category picker
- เลือก category ได้เมื่อสร้าง/แก้ไข fixed cost → transaction ที่ auto-apply แสดง category ถูกต้อง

#### U5. Fixed cost cards — แสดง category icon
- เปลี่ยนจาก "+"/"-" เป็น icon ของ category จริง

#### U6. TransactionList — search + type filter
- ช่อง search กรองตามชื่อรายการ พร้อมนับ "5/147"
- ปุ่ม ทั้งหมด / รายรับ / รายจ่าย filter type

#### U7. Calendar — net balance ในสรุปเดือน
- เพิ่ม card "คงเหลือ" ข้างๆ income/expense (สีฟ้า = บวก, สีเหลือง = ลบ)

#### U8. Calendar — เอา "00:00 น." ออก
- transaction ทุกอันมีเวลา T00:00:00.000 เสมอ → ไม่ informative → เปลี่ยนเป็น "#1", "#2" (ลำดับรายการ)

---

### 🟢 New Features

#### F1. FinancialInsights component (หน้าหลัก)
- **Upcoming**: แสดง fixed costs ที่กำลังจะถึง พร้อม badge "อีก X วัน" / "วันนี้"
- **Category Breakdown**: แสดงรายจ่ายแตก % ตามหมวดหมู่พร้อม progress bar

#### F2. Export/Import รวม Fixed Costs
- Export เพิ่ม sheet `fixedCostsData` → backup ครบทั้ง transactions + fixed costs
- Import อ่าน sheet `fixedCostsData` → restore fixed costs พร้อมกัน

#### F3. Dev Tools ใน Manage page
- ปุ่ม seed test data + clear สำหรับ development เท่านั้น (`NODE_ENV === "development"`)

---

### 1. Import Excel
| | |
|---|---|
| **ก่อนแก้** | มีแค่ Export Excel อย่างเดียว |
| **หลังแก้** | เพิ่ม Import Excel ในหน้า `/manage` — อ่านจาก sheet `jsonData` ก่อน fallback ไป sheet `data`, merge กับข้อมูลเดิม |
| **ดียังไง** | ผู้ใช้ restore ข้อมูลจากไฟล์ที่เคย export ได้ |

### 2. Duplicate key error (TransactionList)
| | |
|---|---|
| **ก่อนแก้** | `groupByDate` ใช้ sequential grouping → วันเดียวกันถูกแยกหลาย group → React warning key ซ้ำ |
| **หลังแก้** | เปลี่ยนเป็น Map-based grouping → วันเดียวกัน merge เข้า group เดียวเสมอ |
| **ดียังไง** | ไม่มี React warning, รายการจัดกลุ่มถูกต้อง |

### 3. รายการไม่ refresh หลังเพิ่ม/แก้ไข
| | |
|---|---|
| **ก่อนแก้** | navigate กลับจาก `/add` → หน้าหลักแสดงข้อมูลเก่า เพราะ component ไม่ re-mount |
| **หลังแก้** | หน้า `/add` dispatch `transactions-updated` event, หน้าหลัก listen แล้ว re-read จาก localStorage |
| **ดียังไง** | เพิ่ม/แก้ไขรายการแล้วเห็นผลทันที |

### 4. เรียงรายการตามวันที่ล่าสุด
| | |
|---|---|
| **ก่อนแก้** | เรียงตาม `id` อย่างเดียว → รายการวันเดียวกันอาจกระจาย |
| **หลังแก้** | เรียงตามวันที่ล่าสุดก่อน ถ้าวันเดียวกันเรียงตาม id |
| **ดียังไง** | รายการจัดกลุ่มตามวันที่สวยงาม ล่าสุดอยู่บนสุด |

### 5. เปลี่ยนธีมเป็น Emerald
| | |
|---|---|
| **ก่อนแก้** | ธีม cyan/blue ทั้ง dark และ light |
| **หลังแก้** | ธีม emerald/green ทุก component, balance card แยกเป็นสีฟ้า |
| **ดียังไง** | สีสดใหม่ แยกสี income (เขียว) / expense (แดง) / balance (ฟ้า) ชัดเจน |

### 6. Icon จัดการข้อมูล
| | |
|---|---|
| **ก่อนแก้** | icon คน (user) |
| **หลังแก้** | icon เฟือง (cogs) |
| **ดียังไง** | สื่อความหมาย "จัดการ/ตั้งค่า" ตรงกว่า |

### 7. Fixed Cost — apply ย้อนหลังทันที
| | |
|---|---|
| **ก่อนแก้** | สร้าง fixed cost ใหม่ `lastApplied: null` → โหลดหน้าแรก apply ทันที + Swal เด้ง |
| **หลังแก้** | สร้างใหม่ set `lastApplied` เป็นเดือน/ปีปัจจุบัน → เริ่ม apply ตั้งแต่รอบถัดไป |
| **ดียังไง** | ไม่เด้ง alert ทันทีหลังสร้าง |

### 8. Fixed Cost — วันที่ผิด
| | |
|---|---|
| **ก่อนแก้** | ใช้ `toISOString()` (UTC) → วันที่เลื่อนใน timezone ไทย |
| **หลังแก้** | ใช้ `YYYY-MM-DDT00:00:00.000` (local time) เหมือน TransactionForm |
| **ดียังไง** | วันที่ตรงทุก timezone |

### 9. Fixed Cost — ไม่มี confirm/alert ตอนบันทึก
| | |
|---|---|
| **ก่อนแก้** | กดบันทึกแล้วปิดฟอร์มเฉยๆ ไม่มี feedback |
| **หลังแก้** | ถาม confirm ก่อนบันทึก + แจ้ง success หลังบันทึก |
| **ดียังไง** | ผู้ใช้มั่นใจว่าบันทึกสำเร็จ ป้องกันกดพลาด |

### 10. README update + Roadmap
| | |
|---|---|
| **ก่อนแก้** | ไม่มี import docs, ไม่มี roadmap |
| **หลังแก้** | เพิ่ม Import/Export section, ธีม Emerald, Roadmap ของ feature ในอนาคต |
| **ดียังไง** | เอกสารครบถ้วน คนอ่านเห็นทิศทางของโปรเจค |

---

## Session 2 — Extended Debug & Feature Sprint (2026-05-31)

### 🔴 Bug Fixes (Session 2)

| # | ไฟล์ | แก้อะไร |
|---|---|---|
| B1 | `TransactionList.jsx` | `sortedItems` ไม่ memoize → เพิ่ม `useMemo` |
| B2 | `ExpenseCalendar.jsx` | `.sort()` mutate array โดยตรง → spread copy |
| B3 | `ExpenseCalendar.jsx` | `navigateMonth` ไม่ reset `expandedWeek` |
| B4 | `ExpenseCalendar.jsx` | DAY_LABELS hardcode ไทย → เปลี่ยนตาม `lang` |
| B5 | `ExpenseCalendar.jsx` | `viewMode` เปลี่ยนแล้ว `selectedDay` ค้าง |
| B6 | `BottomNav.tsx` | `sm:hidden` (640px) ≠ Navbar `md:flex` (768px) → `md:hidden` |
| B7 | `app/layout.tsx` | `pb-16 sm:pb-0` → `pb-16 md:pb-0` |
| B8 | `Dashboard.jsx` | unused variables ลบออก |
| B9 | `FinancialInsights.jsx` | float precision → `Math.round().toLocaleString()` |
| B10 | `ExpenseCalendar.jsx` | ตัวเลข summary ตกบรรทัด → `whitespace-nowrap` + `shortAmount` |
| B11 | `lib/categories.tsx` | `OtherIcon` (⋯) คล้าย "more options" → grid 2×2 |

### 🟡 UX Improvements (Session 2)

| # | แก้อะไร |
|---|---|
| U1 | Calendar: year navigation ปุ่ม « / » |
| U2 | Calendar: fixed cost dots สีม่วงบน cell |
| U3 | Calendar: mobile count badge บน cell |
| U4 | Calendar: ปุ่ม "+ เพิ่ม" ใน day detail → `/add?date=YYYY-MM-DD` |
| U5 | Calendar: net balance card (3 cards) |
| U6 | TransactionList: filter toggle + active badge |
| U7 | TransactionList: amount range `min-w-0 w-0` fix |
| U8 | Dashboard: stat card labels เปลี่ยนตาม viewMode |

### 🟢 New Features (Session 2)

- **PWA** — `manifest.json` + Apple Web App meta tags
- **Note/Memo** — ช่องโน้ตบน transaction form + แสดงใน list
- **Amount range filter** — กรองตามช่วงราคา ขั้นต่ำ–สูงสุด
- **Budget per category** — `budgetService.js` + `BudgetManager.jsx` + progress bar เขียว/เหลือง/แดง
- **Month-over-month** — badge +X% / -X% เทียบเดือนก่อนใน category breakdown
- **Duplicate detector** — scan + ลบรายการซ้ำใน manage page
- **FinancialInsights** — Upcoming fixed costs + Category breakdown (reactive)

### ⚙️ Refactor / Performance (Session 2)

| ไฟล์ | แก้อะไร |
|---|---|
| `DelayedLoader.tsx` | 800ms → 150ms |
| `useSpeechRecognition.ts` | lang-aware (`th-TH`/`en-US`) + cleanup on unmount |
| `Navbar.tsx` | ลบ resize listener → Tailwind `hidden md:flex` |
| `i18n.ts` | "ลบทั้งหมด" แจ้งว่า fixed costs ยังอยู่ |

---

## Commit Message

```
feat: import excel, emerald theme, fixed cost fixes & UX improvements

- Add import Excel (merge with existing data, read jsonData/data sheet)
- Change theme from cyan/blue to emerald/green (dark & light)
- Separate balance card color (blue) from income (green)
- Fix duplicate key in TransactionList (Map-based groupByDate)
- Fix transaction list not refreshing after add/edit (custom event)
- Sort transactions by latest date first, then by id
- Fix fixed cost applying immediately on creation (set lastApplied)
- Fix fixed cost date using UTC instead of local time
- Add confirm dialog and success alert for fixed cost save
- Change manage nav icon from user to cogs
- Update README with import/export docs and roadmap
```
