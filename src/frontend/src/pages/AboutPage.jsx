import { motion } from "framer-motion";
import { Users, Target, Zap, Shield } from "lucide-react";

export default function AboutPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const stats = [
        { label: "Ứng Viên", value: "10,000+" },
        { label: "Doanh Nghiệp", value: "500+" },
        { label: "Việc Làm", value: "5,000+" },
        { label: "Tỷ lệ phản hồi", value: "98%" }
    ];

    const values = [
        {
            icon: <Target className="w-8 h-8 text-[#22c55e]" />,
            title: "Tầm Nhìn Đột Phá",
            description: "Chúng tôi hướng tới việc xây dựng một hệ sinh thái tuyển dụng thông minh, nơi mọi rào cản giữa ứng viên và doanh nghiệp được phá vỡ bởi AI."
        },
        {
            icon: <Zap className="w-8 h-8 text-[#3b82f6]" />,
            title: "Trải Nghiệm Siêu Tốc",
            description: "Quy trình ứng tuyển và lọc hồ sơ diễn ra trong nháy mắt nhờ hệ thống phân tích dữ liệu ứng dụng Machine Learning tối ưu."
        },
        {
            icon: <Shield className="w-8 h-8 text-[#FFAB00]" />,
            title: "Bảo Mật Tối Đa",
            description: "Dữ liệu cá nhân của ứng viên và bí mật kinh doanh của doanh nghiệp được bảo vệ dưới các tiêu chuẩn mã hóa quốc tế khắt khe nhất."
        },
        {
            icon: <Users className="w-8 h-8 text-[#ef4444]" />,
            title: "Tuyển Dụng Nhân Bản",
            description: "Dù sử dụng AI tiên tiến, mọi quyết định cuối cùng và sự tương tác đều hướng tới giá trị cốt lõi là Con Người."
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFC] dark:bg-[#141A21] pt-24 pb-20 overflow-hidden relative">
            {/* Ambient Base */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#22c55e]/10 to-transparent pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                
                {/* Hero Section */}
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1C252E] dark:text-white mb-6 font-sans tracking-tight">
                        Kiến tạo tương lai <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-[#10b981]">
                            Tuyển dụng thông minh
                        </span>
                    </motion.h1>
                    <motion.p variants={fadeIn} className="text-[#637381] dark:text-[#919EAB] text-lg leading-relaxed">
                        Recruitment Platform sinh ra với sứ mệnh xóa bỏ khoảng cách giữa nhân tài và cơ hội. Chúng tôi không chỉ là nền tảng tìm việc, mà là người bạn đồng hành AI dẫn dắt bạn tới đỉnh cao sự nghiệp.
                    </motion.p>
                </motion.div>

                {/* Stats Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
                >
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#1C252E] rounded-3xl p-8 text-center border border-[rgba(145,158,171,0.12)] shadow-xl shadow-green-500/5">
                            <div className="text-3xl md:text-4xl font-black text-[#1C252E] dark:text-white mb-2">{stat.value}</div>
                            <div className="text-sm font-semibold text-[#637381] dark:text-[#919EAB] uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Core Values */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#1C252E] dark:text-white mb-4">Giá trị cốt lõi</h2>
                        <p className="text-[#637381] dark:text-[#919EAB]">Chuẩn mực làm việc của nền tảng chúng tôi</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, idx) => (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white dark:bg-[#1C252E]/80 backdrop-blur-md rounded-2xl p-8 border border-[rgba(145,158,171,0.12)] flex gap-6 hover:border-[#22c55e]/50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-[#141A21] flex items-center justify-center shadow-inner">
                                        {value.icon}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1C252E] dark:text-white mb-3">{value.title}</h3>
                                    <p className="text-[#637381] dark:text-[#919EAB] leading-relaxed">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl bg-gradient-to-br from-[#1C252E] to-[#0A0F16] border border-white/10 p-12 text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'24\\' height=\\'24\\' viewBox=\\'0 0 24 24\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.1\\'/%3E%3C/svg%3E')] opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#22c55e]/30 rounded-full blur-[100px] pointer-events-none" />
                    
                    <h2 className="relative z-10 text-3xl md:text-4xl font-bold text-white mb-6">Sẵn sàng để bắt đầu?</h2>
                    <p className="relative z-10 text-gray-300 mb-8 max-w-2xl mx-auto">Tham gia cùng hàng ngàn ứng viên và nhà tuyển dụng ưu tú trên nền tảng của chúng tôi ngay hôm nay.</p>
                    <a href="/register" className="relative z-10 inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#1C252E] bg-white hover:bg-gray-100 rounded-xl transition-transform hover:scale-105 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        Tham gia nền tảng
                    </a>
                </motion.div>

            </div>
        </div>
    );
}
