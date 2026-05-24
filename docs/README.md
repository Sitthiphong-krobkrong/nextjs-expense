# Documentation Assets

โฟลเดอร์นี้ใช้เก็บ asset สำหรับ documentation (รูปภาพ, GIF, แผนภาพ)

## โครงสร้าง

```
docs/
└── screenshots/        # ภาพหน้าจอแอป (อ้างใน README.md)
    ├── dashboard.png
    ├── calendar.png
    ├── add.png
    └── dark-mode.png
```

## วิธีถ่าย screenshot

1. รันแอป: `npm run dev`
2. เปิด http://localhost:3000
3. เพิ่มข้อมูลตัวอย่างให้ดูสวย ๆ (เช่น 5-10 รายการครอบคลุม 2-3 เดือน)
4. ถ่ายภาพหน้าหลัก, ปฏิทิน, หน้า /add, และโหมด Dark
5. บันทึกไว้ใน `docs/screenshots/` ด้วยชื่อตามตัวอย่างด้านบน
6. README.md จะอ้างอิงภาพอัตโนมัติเมื่อมีไฟล์เหล่านี้
