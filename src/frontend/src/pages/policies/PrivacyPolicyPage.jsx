export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#FAFBFC] dark:bg-[#141A21] pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-4 prose prose-emerald dark:prose-invert">
                <h1 className="text-4xl font-black text-[#1C252E] dark:text-white mb-2">Chính sách bảo mật</h1>
                <p className="text-[#637381] dark:text-[#919EAB] mb-10">Cập nhật lần cuối: Tháng 4, 2026</p>

                <section className="mb-10 text-[#1C252E] dark:text-gray-300 leading-relaxed">
                    <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-4">1. Thu thập thông tin cá nhân</h2>
                    <p className="mb-4">
                        Recruitment Platform cam kết bảo mật tuyệt đối thông tin của người dùng. Chúng tôi chỉ thu thập các dữ liệu thực sự cần thiết để cải thiện trải nghiệm ứng tuyển, bao gồm:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Họ tên, email, và số điện thoại liên lạc.</li>
                        <li>Nội dung Sơ yếu lý lịch (CV) và các chứng chỉ liên quan do bạn tự nguyện tải lên.</li>
                        <li>Lịch sử ứng tuyển và tương tác của bạn với các nhà tuyển dụng trên nền tảng.</li>
                    </ul>
                </section>

                <section className="mb-10 text-[#1C252E] dark:text-gray-300 leading-relaxed">
                    <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-4">2. Sử dụng dữ liệu bằng AI</h2>
                    <p className="mb-4">
                        Hệ thống Trí tuệ Nhân tạo (AI) của chúng tôi sử dụng dữ liệu từ CV của bạn để:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Phân tích kỹ năng và tự động ghép nối với các công việc phù hợp trên thị trường.</li>
                        <li>Hỗ trợ viết Thư xin việc (Cover Letter) cá nhân hoá theo từng vị trí ứng tuyển.</li>
                        <li>Chúng tôi tuyệt đối <strong>KHÔNG</strong> chia sẻ, bán, hoặc cho thuê dữ liệu huấn luyện AI chứa từ khóa danh tính của bạn cho bất kỳ bên thứ ba vô danh nào.</li>
                    </ul>
                </section>

                <section className="mb-10 text-[#1C252E] dark:text-gray-300 leading-relaxed">
                    <h2 className="text-2xl font-bold text-[#1C252E] dark:text-white mb-4">3. Quyền lợi của bạn</h2>
                    <p className="mb-4">Theo tiêu chuẩn bảo mật dữ liệu toàn cầu (GDPR/CCPA), bạn có toàn quyền đối với dữ liệu của mình tại Recruitment Platform:</p>
                    <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Yêu cầu trích xuất toàn bộ dữ liệu cá nhân (Export Data).</li>
                        <li>Yêu cầu xóa vĩnh viễn tài khoản và các nội dung đã tải lên khỏi máy chủ.</li>
                    </ul>
                </section>

                <p className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-12 text-[#637381]">
                    Nếu bạn có bất kỳ câu hỏi nào về chính sách này, xin vui lòng gửi email về <strong>privacy@recruitmentplatform.com</strong>.
                </p>
            </div>
        </div>
    );
}
