export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FAFBFC] dark:bg-[#141A21] pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-4 prose prose-emerald dark:prose-invert">
                <h1 className="text-4xl font-black text-[#1C252E] dark:text-white mb-2">Điều khoản sử dụng</h1>
                <p className="text-[#637381] dark:text-[#919EAB] mb-10">Có hiệu lực từ: Tháng 4, 2026</p>

                <section className="mb-10 text-[#1C252E] dark:text-gray-300 leading-relaxed">
                    <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-4">Chấp nhận điều khoản</h2>
                    <p className="mb-4">
                        Khi sử dụng dịch vụ của Recruitment Platform, bạn đồng ý tuân thủ toàn bộ các chính sách và điều kiện được nêu tại đây. Các quy định này áp dụng cho mọi khách ghé thăm, ứng viên, đến các Nhà tuyển dụng có mở tài khoản hoạt động.
                    </p>
                </section>

                <section className="mb-10 text-[#1C252E] dark:text-gray-300 leading-relaxed">
                    <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-4">Quy định đối với Ứng Viên</h2>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Bạn cam kết mọi thông tin cung cấp (CV, bằng cấp, kinh nghiệm) là sự thật.</li>
                        <li>Nghiêm cấm hành vi lợi dụng chức năng rải đơn AI để spam doanh nghiệp vì mục đích phá hoại.</li>
                        <li>Nền tảng đóng vai trò là "Người hỗ trợ", chúng tôi không cam kết 100% người dùng sẽ nhận được việc làm, điều này phụ thuộc vào năng lực thực tế.</li>
                    </ul>
                </section>

                <section className="mb-10 text-[#1C252E] dark:text-gray-300 leading-relaxed">
                    <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-4">Quy định đối với Doanh Nghiệp (HR)</h2>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Mọi thông tin đăng tuyển phải tuân thủ pháp luật lao động sở tại.</li>
                        <li>Nghiêm cấm các bài đăng tuyển lừa đảo, đa cấp bất hợp pháp, hay phân biệt đối xử.</li>
                        <li>Recruitment Platform bảo lưu quyền đơn phương từ chối cung cấp dịch vụ hoặc xóa bài đăng vi phạm mà không cần hoàn phí.</li>
                    </ul>
                </section>

                <section className="mb-10 text-[#1C252E] dark:text-gray-300 leading-relaxed">
                    <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-4">Giới hạn trách nhiệm</h2>
                    <p className="mb-4">
                        Tính năng tạo CV và Cover Letter bằng AI nhằm mục đích tham khảo. Người dùng chịu trách nhiệm kiểm tra lại tính chính xác trước khi ứng tuyển. Chúng tôi không chịu trách nhiệm pháp lý nếu nội dung tự động cung cấp gây sai lệch dẫn đến các quyết định thiệt hại từ phía bên thứ ba.
                    </p>
                </section>

            </div>
        </div>
    );
}
