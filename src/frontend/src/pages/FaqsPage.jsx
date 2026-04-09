import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Briefcase, FileText, User } from "lucide-react";

// ============================================
// FAQs PAGE 
// ============================================

const faqsData = [
    // --- Category: Apply & Find Jobs ---
    {
        id: "q1",
        category: "jobs",
        question: "Khi nào hệ thống sẽ bắt đầu ứng tuyển các công việc thay tôi?",
        answer: "Hệ thống bắt đầu ứng tuyển việc làm sau khi Persona của bạn được thiết lập, thường mất khoảng 1-2 ngày. Sau đó, AI sẽ tự động tìm kiếm các công việc phù hợp với hồ sơ của bạn. Nếu bạn đang sử dụng gói trả phí, việc ứng tuyển thường bắt đầu trong khoảng 3-4 ngày sau khi bạn đăng ký và hoàn thành hồ sơ."
    },
    {
        id: "q2",
        category: "jobs",
        question: "Tôi có thể tránh ứng tuyển vào một số công ty nhất định không?",
        answer: "Có, bạn hoàn toàn có thể liệt kê công ty vào danh sách đen (blacklist). Truy cập phần Tài khoản trong phần Cài đặt và thêm bất kỳ công ty nào bạn muốn loại trừ."
    },
    {
        id: "q3",
        category: "jobs",
        question: "Nền tảng ứng dụng AI như thế nào để nộp đơn?",
        answer: "Hệ thống AI tiên tiến của chúng tôi phân tích kỹ lưỡng các bản mô tả công việc, đảm bảo đơn ứng tuyển của bạn cung cấp những câu trả lời chuyên nghiệp, chính xác và bám sát yêu cầu."
    },
    {
        id: "q4",
        category: "jobs",
        question: "Sẽ mất bao lâu để tôi tìm được việc?",
        answer: "Việc tìm kiếm công việc phù hợp có thể mất vài tuần tùy thuộc vào thị trường lao động và trình độ chuyên môn của bạn. Thông thường, bạn sẽ bắt đầu nhận được thông tin phản hồi từ nhà tuyển dụng sau khoảng vài tuần."
    },

    // --- Category: Resume & cover letter ---
    {
        id: "q11",
        category: "resume",
        question: "Hệ thống có tự động tạo thư xin việc (cover letter) không?",
        answer: "Có! Chúng tôi cung cấp tính năng mạnh mẽ giúp thiết kế một cover letter hoàn toàn được cá nhân hóa cho từng cơ hội việc làm dựa trên CV của bạn."
    },
    {
        id: "q12",
        category: "resume",
        question: "CV chuẩn ATS là gì?",
        answer: "CV ATS (Applicant Tracking System) là một định dạng CV được thiết kế để phần mềm lọc đơn của phía nhà tuyển dụng có thể dễ dàng đọc và đánh giá, tăng khả năng vượt qua vòng máy học."
    },
    {
        id: "q13",
        category: "resume",
        question: "Trình tạo CV hoạt động thế nào?",
        answer: "Trình tạo lấy thông tin bạn đã cung cấp, kết hợp yêu cầu nhà tuyển dụng và tạo CV có thiết kế thu hút. Bạn chỉ mất vài thao tác để có phiên bản xuất định dạng PDF chất lượng cao."
    },

    // --- Category: General ---
    {
        id: "q18",
        category: "general",
        question: "Dữ liệu cá nhân của tôi có an toàn trên Recruitment Platform không?",
        answer: "Chắc chắn rồi. Thông tin cá nhân của bạn hoàn toàn được bảo vệ dưới các chính sách bảo mật dữ liệu nghiêm ngặt và mã hóa an toàn."
    },
    {
        id: "q19",
        category: "general",
        question: "Hệ thống thu thập những loại dữ liệu nào?",
        answer: "Chúng tôi chỉ lưu trữ các thông tin liên quan đến hồ sơ nghề nghiệp của bạn như nội dung CV, email liên lạc, và lịch sử ứng tuyển nhằm phục vụ chiến lược gợi ý việc làm chính xác nhất."
    },
    {
        id: "q20",
        category: "general",
        question: "Tôi có thể tự xóa tài khoản của mình không?",
        answer: "Hoàn toàn được. Bạn có thể sử dụng chức năng vô hiệu hóa hoặc xóa bộ nhớ hồ sơ ứng tuyển mãi mãi thông qua menu cài đặt."
    }
];

export default function FaqsPage() {
    const [activeCategory, setActiveCategory] = useState("jobs");
    const [openIndex, setOpenIndex] = useState(null);

    // Filter FAQs by tab
    const filteredFaqs = faqsData.filter((faq) => faq.category === activeCategory);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <div className="w-full relative min-h-screen py-24 pb-32 bg-[#FAFBFC] dark:bg-[#141A21]">
            <div className="container mx-auto px-4 relative z-10">

                {/* 1. Hero Title */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-16 pt-10"
                >
                    <motion.div variants={itemVariants}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#1C252E] dark:text-white mb-6 font-sans">
                            <span className="block mt-1 bg-gradient-to-r from-[#22c55e] via-[#10b981] to-[#3b82f6] bg-clip-text text-transparent pb-2">
                                Chúng tôi giúp gì được cho bạn?
                            </span>
                        </h1>
                        <p className="text-[#637381] dark:text-[#919EAB] text-lg max-w-2xl mx-auto">
                            Khám phá thư viện câu hỏi thường gặp để hiểu rõ cách hoạt động của Recruitment Platform và tối ưu hóa trải nghiệm tìm việc / tuyển dụng của bạn.
                        </p>
                    </motion.div>
                </motion.div>

                {/* 2. Categories Tabs */}
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 mb-16">
                    <button
                        onClick={() => { setActiveCategory("jobs"); setOpenIndex(null); }}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${activeCategory === "jobs"
                            ? "bg-white dark:bg-[#1C252E] border-[#22c55e] shadow-lg shadow-green-500/10 scale-[1.02]"
                            : "bg-white/50 dark:bg-[#1C252E]/50 border-[rgba(145,158,171,0.12)] hover:border-[#22c55e]/30 text-[#637381] dark:text-[#919EAB]"
                            }`}
                    >
                        <div className={`p-2 rounded-full ${activeCategory === "jobs" ? "bg-green-100 dark:bg-green-900/30 text-[#22c55e]" : "bg-gray-100 dark:bg-gray-800"}`}>
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <span className={`font-semibold ${activeCategory === "jobs" ? "text-[#1C252E] dark:text-white" : ""}`}>
                            Cơ Hội Việc Làm
                        </span>
                    </button>

                    <button
                        onClick={() => { setActiveCategory("resume"); setOpenIndex(null); }}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${activeCategory === "resume"
                            ? "bg-white dark:bg-[#1C252E] border-[#3b82f6] shadow-lg shadow-blue-500/10 scale-[1.02]"
                            : "bg-white/50 dark:bg-[#1C252E]/50 border-[rgba(145,158,171,0.12)] hover:border-[#3b82f6]/30 text-[#637381] dark:text-[#919EAB]"
                            }`}
                    >
                        <div className={`p-2 rounded-full ${activeCategory === "resume" ? "bg-blue-100 dark:bg-blue-900/30 text-[#3b82f6]" : "bg-gray-100 dark:bg-gray-800"}`}>
                            <FileText className="w-5 h-5" />
                        </div>
                        <span className={`font-semibold ${activeCategory === "resume" ? "text-[#1C252E] dark:text-white" : ""}`}>
                            Hồ Sơ & CV
                        </span>
                    </button>

                    <button
                        onClick={() => { setActiveCategory("general"); setOpenIndex(null); }}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${activeCategory === "general"
                            ? "bg-white dark:bg-[#1C252E] border-[#FFAB00] shadow-lg shadow-yellow-500/10 scale-[1.02]"
                            : "bg-white/50 dark:bg-[#1C252E]/50 border-[rgba(145,158,171,0.12)] hover:border-[#FFAB00]/30 text-[#637381] dark:text-[#919EAB]"
                            }`}
                    >
                        <div className={`p-2 rounded-full ${activeCategory === "general" ? "bg-yellow-100 dark:bg-yellow-900/30 text-[#FFAB00]" : "bg-gray-100 dark:bg-gray-800"}`}>
                            <User className="w-5 h-5" />
                        </div>
                        <span className={`font-semibold ${activeCategory === "general" ? "text-[#1C252E] dark:text-white" : ""}`}>
                            Chung & Tài khoản
                        </span>
                    </button>
                </div>

                {/* 3. FAQ Accordion List */}
                <div className="max-w-3xl mx-auto space-y-4 relative min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredFaqs.map((faq, index) => (
                            <motion.div
                                key={faq.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <div className={`bg-white dark:bg-[#1C252E] border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === faq.id ? 'border-[#22c55e]/50 shadow-lg shadow-green-500/5' : 'border-[rgba(145,158,171,0.12)] hover:border-[rgba(145,158,171,0.32)]'}`}>
                                    <button
                                        onClick={() => setOpenIndex(openIndex === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <span className={`text-base font-semibold pr-4 transition-colors ${openIndex === faq.id ? 'text-[#22c55e]' : 'text-[#1C252E] dark:text-white'}`}>
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openIndex === faq.id ? "rotate-180 text-[#22c55e]" : "text-[#637381] dark:text-[#919EAB]"}`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                <div className="px-6 pb-6 text-sm text-[#637381] dark:text-[#919EAB] leading-relaxed border-t border-[rgba(145,158,171,0.08)] pt-4 mt-2">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Ambient Background Elements */}
            <div className="absolute top-40 -left-40 w-96 h-96 bg-[#22c55e]/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-80 -right-40 w-96 h-96 bg-[#3b82f6]/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}
