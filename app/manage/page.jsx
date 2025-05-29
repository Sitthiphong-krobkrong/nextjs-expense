"use client"
import React from "react";
import Swal from "sweetalert2";
import { deleteAllTransactions } from "@/services/transactionService";
import { exportExcelFromLocalStorage } from "@/services/manageService";
export default function ManagePage() {
    return (
        <>
            <div className="min-h-screen bg-gray-50 p-8 text-center">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">จัดการข้อมูล</h1>
                    <p className="text-lg mb-8"></p>
                    <div className="mb-6">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={async () => {
                                const result = await Swal.fire({
                                    title: "ลบข้อมูล Transactions?",
                                    text: "คุณต้องการลบข้อมูล Transactions ทั้งหมดหรือไม่? หากลบแล้วจะไม่สามารถกู้คืนได้",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: "ใช่",
                                    cancelButtonText: "ยกเลิก",
                                });
                                if (result.isConfirmed) {
                                    await deleteAllTransactions();
                                    Swal.fire("ลบข้อมูล!", "ข้อมูล Transactions ถูกลบเรียบร้อย", "success");
                                }
                            }}
                        >
                            ลบข้อมูล Transactions ทั้งหมด
                        </button>
                    </div>
                    <div className="mb-6">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={async () => {
                                const result = await Swal.fire({
                                    title: "ส่งออกข้อมูลเป็น Excel?",
                                    text: "คุณต้องการส่งออกข้อมูล Transactions เป็นไฟล์ Excel หรือไม่?",
                                    icon: "question",
                                    showCancelButton: true,
                                    confirmButtonText: "ใช่",
                                    cancelButtonText: "ยกเลิก",
                                });
                                if (result.isConfirmed) {
                                    try {
                                        await exportExcelFromLocalStorage();
                                        Swal.fire("สำเร็จ!", "ข้อมูลถูกส่งออกเป็นไฟล์ Excel เรียบร้อยแล้ว", "success");
                                    }
                                    catch (error) {
                                        console.error("Error exporting data:", error);
                                        Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถส่งออกข้อมูลได้", "error");
                                    }
                                }
                            }
                            }
                        >
                            ส่งออกข้อมูลเป็น Excel
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
}