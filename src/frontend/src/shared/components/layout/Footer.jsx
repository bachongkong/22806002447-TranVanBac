import { Link } from "react-router-dom";
import { Globe, Mail, Phone } from "lucide-react";

export function Footer() {
    const footerLinks = {
        "Tính năng": [
            { label: "AI Resume Builder", href: "/cv-builder" },
            { label: "AI Cover Letter", href: "/cover-letter" },
            { label: "AI Tìm Việc", href: "/jobs" },
            { label: "ATS Checker", href: "/ats-checker" }
        ],
        "Recruitment Platform": [
            { label: "Về Chúng Tôi", href: "/about" },
            { label: "Liên Hệ", href: "/contact" },
            { label: "Tuyển Dụng", href: "/careers" }
        ],
        "Pháp lý": [
            { label: "Điều Khoản", href: "/terms" },
            { label: "Chính Sách Bảo Mật", href: "/privacy" }
        ]
    };

    return (
        <footer className="w-full border-t border-[rgba(145,158,171,0.2)] bg-white dark:bg-[#1C252E] pt-16 pb-8 relative z-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1 pr-8">
                        <Link to="/" className="flex items-center gap-3 mb-4 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#10b981] flex items-center justify-center shadow-lg shadow-green-500/25 transition-transform group-hover:scale-105 group-hover:-rotate-3">
                                {/* Vector Cube Logo */}
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9"/>
                                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="text-[#1C252E] dark:text-white font-black text-xl tracking-tight font-mono">
                                Recruitment<span className="text-[#22c55e]">Platform</span>
                            </span>
                        </Link>
                        <p className="text-sm text-[#637381] dark:text-[#919EAB] leading-relaxed">
                            Recruitment Platform: Kết nối nhân tài với cơ hội việc làm hoàn hảo thông qua công nghệ AI thông minh.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#1C252E] dark:text-white mb-4">Sản Phẩm</h4>
                        <ul className="space-y-2 text-sm text-[#637381] dark:text-[#919EAB]">
                            {footerLinks["Tính năng"].map((link) => (
                                <li key={link.label}>
                                    <Link to={link.href} className="hover:text-[#1C252E] dark:hover:text-white transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#1C252E] dark:text-white mb-4">Công Ty</h4>
                        <ul className="space-y-2 text-sm text-[#637381] dark:text-[#919EAB]">
                            {footerLinks["Recruitment Platform"].map((link) => (
                                <li key={link.label}>
                                    <Link to={link.href} className="hover:text-[#1C252E] dark:hover:text-white transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#1C252E] dark:text-white mb-4">Pháp Lý</h4>
                        <ul className="space-y-2 text-sm text-[#637381] dark:text-[#919EAB]">
                            {footerLinks["Pháp lý"].map((link) => (
                                <li key={link.label}>
                                    <Link to={link.href} className="hover:text-[#1C252E] dark:hover:text-white transition-colors">{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-[rgba(145,158,171,0.2)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[#637381] dark:text-[#919EAB] font-medium">&copy; 2026 Recruitment Platform. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link to="#" className="text-[#637381] dark:text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white transition-colors">
                            <Globe className="w-5 h-5" />
                        </Link>
                        <Link to="#" className="text-[#637381] dark:text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white transition-colors">
                            <Mail className="w-5 h-5" />
                        </Link>
                        <Link to="#" className="text-[#637381] dark:text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white transition-colors">
                            <Phone className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

