"use client";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
/**
 * Form to add or edit a transaction
 */
export default function TransactionForm({ onSave, editing, onCancel }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const loadingTimeout = useRef();
  const [subType, setSubType] = useState("expense");

  useEffect(() => {
    if (editing) {
      setDescription(editing.description);
      setAmount(String(editing.amount));
      setType(editing.type);
    }
  }, [editing]);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await Swal.fire({
      title: "ยืนยันการบันทึกรายการ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, บันทึก",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    // Validation
    if (!description.trim()) {
      await Swal.fire({
        icon: "error",
        title: "กรุณากรอกรายละเอียด",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      await Swal.fire({
        icon: "error",
        title: "จำนวนเงินต้องเป็นตัวเลขมากกว่า 0",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    if (type !== "income" && type !== "expense") {
      await Swal.fire({
        icon: "error",
        title: "ประเภทไม่ถูกต้อง",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    const tx = {
      id: editing ? editing.id : Date.now(),
      description,
      amount: parsedAmount,
      type,
      date: new Date().toISOString(),
    };
    onSave(tx);
    setDescription("");
    setAmount("");
    setType("expense");

    await Swal.fire({
      icon: "success",
      title: "บันทึกรายการเรียบร้อย",
      confirmButtonText: "ตกลง",
    });
  }

  // ฟังก์ชันสำหรับ handle loading timeout
  const handleTimeout = () => {
    setLoading(false);
    setShowOverlay(false);
    Swal.fire({
      icon: "error",
      title: "ขออภัย",
      text: "การอัปโหลดใช้เวลานานเกินไป (15 วินาที)",
      confirmButtonText: "ตกลง",
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setShowOverlay(true);

    // ตั้ง timeout 15 วิ
    //loadingTimeout.current = setTimeout(handleTimeout, 15000);

    try {
      const res = await fetch("http://localhost:8000/ocr/slip", {
        method: "POST",
        body: formData,
      });

      //clearTimeout(loadingTimeout.current); // clear ทันทีที่ API ตอบกลับ
      setLoading(false);
      setShowOverlay(false);

      // กรณี API error (HTTP 400+, หรือ network error)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || `API error: ${res.status} ${res.statusText}`
        );
      }

      // กรณี response 200+
      const data = await res.json();

      // ถ้ามี data.url → สำเร็จ
      if (data.url) {
        await Swal.fire({
          icon: "success",
          title: "อัปโหลดไฟล์สำเร็จ",
          html: `<a href="${data.url}" target="_blank" class="underline text-blue-600">${data.url}</a>`,
          confirmButtonText: "ตกลง",
        });
        fileRef.current.value = "";
        return;
      }

      // กรณีเป็น slip OCR ตรงนี้เลย
      if (data.amount) {
        await Swal.fire({
          icon: "success",
          title: "อ่านข้อมูลจำนวนเงินสำเร็จ",
          text: `จำนวนเงินที่พบ: ${data.amount}`,
          confirmButtonText: "ตกลง",
        });
        setAmount(data.amount);
        fileRef.current.value = "";
        return;
      }

      // ถ้าไม่เจอ amount
      await Swal.fire({
        icon: "info",
        title: "อ่านข้อมูลจำนวนเงินในไฟล์ไม่สำเร็จ [code:400]",
        text: "กรุณากรอกจำนวนเงินด้วยตนเอง",
        confirmButtonText: "ตกลง",
      });
      fileRef.current.value = "";

    } catch (err) {
      clearTimeout(loadingTimeout.current);
      setLoading(false);
      setShowOverlay(false);
      await Swal.fire({
        icon: "error",
        title: "อ่านข้อมูลจำนวนเงินในไฟล์ไม่สำเร็จ [code:500]",
        text: "กรุณากรอกจำนวนเงินด้วยตนเอง",
        confirmButtonText: "ตกลง",
      });
      console.error(err.message);
    } finally {
      setLoading(false);
      setShowOverlay(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span>
          {editing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline w-5 h-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7l-1.5-1.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline w-5 h-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </span>
        {editing ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}
      </h2>

      <div className="relative">
        {/* Overlay Loading */}
        {showOverlay && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50"
            style={{ pointerEvents: "auto" }}
          >
            <svg
              className="animate-spin mb-4"
              width={54}
              height={54}
              viewBox="0 0 50 50"
            >
              <circle
                className="opacity-25"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#fff"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="#fff"
                d="M25 5a20 20 0 0 1 20 20h-4a16 16 0 1 0-16 16V5z"
              />
            </svg>
            <div className="text-white text-lg font-bold">
              กำลังประมวลผล กรุณารอสักครู่...
            </div>
          </div>
        )}

        {/* <label className="block text-sm font-medium mb-1">แนบไฟล์</label>
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          disabled={loading}
          onChange={handleFileChange}
          className="w-full mt-1 p-2 border rounded"
        /> */}
        {/* <button
          disabled={loading}
          className={`mt-3 px-4 py-2 rounded ${loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          onClick={() => fileRef.current.click()}
          type="button"
        >
          ตรวจสอบไฟล์แนบ
        </button> */}
      </div>

      <div>
        <label className="block text-sm">จำนวนเงิน</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm">รายละเอียด</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm">ประเภท</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={
            type === "expense"
              ? "text-red-500  w-full mt-1 p-2 border rounded"
              : "text-green-500 w-full mt-1 p-2 border rounded"
          }
        >
          <option value="income">+รายรับ</option>
          <option value="expense">-รายจ่าย</option>
        </select>
      </div>
      {/* <div>
        <label className="block text-sm">ประเภทย่อย</label>
        <select
          value={subType}
          onChange={(e) => setSubType(e.target.value)}
          className={
            type === "expense"
              ? "text-red-500  w-full mt-1 p-2 border rounded"
              : "text-green-500 w-full mt-1 p-2 border rounded"
          }
        >
          <option value="food">-อาหาร</option>
          <option value="transport">-ขนส่ง</option>
          <option value="entertainment">-บันเทิง</option>
          <option value="utilities">-ค่าสาธารณูปโภค</option>
          <option value="shopping">-ช้อปปิ้ง</option>
          <option value="health">-สุขภาพ</option>
          <option value="education">-การศึกษา</option>
          <option value="salary">+เงินได้</option>
          <option value="gift">+ของขวัญ</option>
          <option value="other">-อื่นๆ</option>
        </select>
      </div> */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 flex items-center gap-2"
        >
          {editing ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              บันทึก
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              เพิ่ม
            </>
          )}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
