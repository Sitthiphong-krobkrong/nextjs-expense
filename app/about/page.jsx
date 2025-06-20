export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-extrabold mb-6">เกี่ยวกับเรา</h1>
                <p className="text-lg  text-left text-gray-800 mb-6">
                    Application ถูกสร้างขึ้นเพื่อให้คุณสามารถจัดการข้อมูลรายรับราย-จ่ายได้อย่างสะดวก รวดเร็ว และปลอดภัย ด้วยเทคโนโลยี React และ Next.js
                </p>
                <div className="mb-6 text-left text-gray-700 leading-relaxed">
                    <p>• บันทึกรายรับ-รายจ่ายได้ง่ายดาย พร้อมฟีเจอร์เพิ่ม แก้ไข และลบรายการทันที</p>
                    <p>• ส่งออกข้อมูลเป็นไฟล์ Excel เพื่อนำไปวิเคราะห์หรือเก็บสำรองได้อย่างมืออาชีพ</p>
                    <p>• ไร้กังวลเรื่องการเชื่อมต่ออินเทอร์เน็ต เพราะข้อมูลทั้งหมดจัดเก็บใน Local Storage ของเบราว์เซอร์</p>
                </div>
                <p className="text-base text-gray-600 mb-4 text-left">
                    เราใส่ใจในประสิทธิภาพและประสบการณ์ใช้งานของคุณ หากมีข้อเสนอแนะหรือพบปัญหาใด ๆ ติดต่อเราได้ที่
                    <a href="mailto: sitthiphong.krobkrong@gmail.com" className="text-blue-600 hover:underline ml-1">
                        sitthiphong.krobkrong@gmail.com และ famecwk12@gmail.com
                    </a>
                </p>
            </div>
        </div>
    )
}