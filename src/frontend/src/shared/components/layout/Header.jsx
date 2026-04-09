import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { cn } from "@/shared/utils/cn";

// auth hook based on MainLayout
import useAuthStore from '@app/store/authStore';
import { useLogout } from '@features/auth';

const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Về chúng tôi", href: "/about" },
    { label: "Hỏi đáp", href: "/faqs" },
];

export function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();
    
    // Use actual auth
    const { isAuthenticated, user } = useAuthStore();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest < 50) {
            setIsVisible(true);
        } else {
            setIsVisible(latest < lastScrollY ? true : false);
        }
        setLastScrollY(latest);
    });

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'candidate': return '/candidate/dashboard';
            case 'hr': return '/hr/dashboard';
            case 'admin': return '/admin/dashboard';
            default: return '/';
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    const headerVariants = {
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
    };

    return (
        <motion.header
            className="fixed top-0 inset-x-0 z-50"
            variants={headerVariants}
            initial="visible"
            animate={isVisible ? "visible" : "hidden"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#10b981] flex items-center justify-center shadow-lg shadow-green-500/25 transition-transform group-hover:scale-105 group-hover:-rotate-3">
                            {/* Vector Cube Logo */}
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9"/>
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-[#1C252E] dark:text-white font-black text-xl tracking-tight hidden sm:block font-mono">
                            Recruitment<span className="text-[#22c55e]">Platform</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((item) => {
                            const isActive = item.href === pathname || (item.children && item.children.some(child => child.href === pathname));
                            return item.children ? (
                                <div key={item.label} className="relative group">
                                    <button className={cn(
                                        "flex items-center gap-1.5 text-sm font-medium transition-colors py-2",
                                        isActive ? "text-[#22c55e]" : "text-[#637381] dark:text-[#919EAB] group-hover:text-[#1C252E] dark:group-hover:text-white"
                                    )}>
                                        {item.label}
                                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                    </button>
                                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="w-56 bg-white dark:bg-[#1C252E] rounded-xl shadow-xl border border-[rgba(145,158,171,0.12)] p-2 backdrop-blur-xl">
                                            {item.children.map(child => (
                                                <Link
                                                    key={child.label}
                                                    to={child.href}
                                                    className={cn(
                                                        "block px-4 py-2.5 text-sm font-medium hover:bg-[rgba(145,158,171,0.04)] dark:hover:bg-[rgba(145,158,171,0.08)] rounded-lg transition-colors",
                                                        pathname === child.href ? "text-[#22c55e] bg-[rgba(34,197,94,0.08)]" : "text-[#637381] dark:text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white"
                                                    )}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors py-2",
                                        pathname === item.href ? "text-[#22c55e]" : "text-[#637381] dark:text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {!isAuthenticated ? (
                            <div className="hidden md:flex items-center gap-3">
                                <Link to="/login" className="text-sm font-semibold px-5 py-2 rounded-lg border border-[rgba(145,158,171,0.32)] dark:border-white/20 text-[#1C252E] dark:text-white hover:bg-[rgba(145,158,171,0.08)] dark:hover:bg-white/[0.06] transition-colors">
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#1C252E] dark:bg-white text-white dark:text-[#1C252E] hover:bg-[#1C252E]/90 dark:hover:bg-white/90 transition-colors">
                                    Đăng ký
                                </Link>
                            </div>
                        ) : (
                             <div className="hidden md:flex items-center gap-3">
                                <Link to={getDashboardLink()} className="text-sm font-semibold px-5 py-2 rounded-lg border border-[rgba(145,158,171,0.32)] dark:border-white/20 text-[#1C252E] dark:text-white hover:bg-[rgba(145,158,171,0.08)] dark:hover:bg-white/[0.06] transition-colors">
                                    Bảng điều khiển
                                </Link>
                                <button onClick={handleLogout} disabled={isLoggingOut} className="text-sm font-semibold px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                                    Đăng xuất
                                </button>
                             </div>
                        )}
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[#637381] dark:text-[#919EAB] hover:text-[#1C252E] dark:hover:text-white">
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-[#141A21]/95 backdrop-blur-xl border-t border-[rgba(145,158,171,0.2)]"
                    >
                        <div className="px-4 py-4 space-y-3">
                           {/* Simplified mobile nav for brevity */}
                           {!isAuthenticated ? (
                                <Link to="/login" className="block text-center text-base font-semibold py-2.5 rounded-lg bg-[#1C252E] dark:bg-white text-white dark:text-[#1C252E] transition-colors">Đăng nhập</Link>
                           ) : (
                                <button onClick={handleLogout} className="w-full text-center text-base font-semibold py-2.5 rounded-lg bg-[#FF5630]/10 text-[#FF5630] hover:bg-[#FF5630]/20 transition-colors">Đăng xuất</button>
                           )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}

