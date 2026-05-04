# Changelog

## Unreleased

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
