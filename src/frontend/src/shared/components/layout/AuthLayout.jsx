import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function AuthLayout({ children }) {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FAFBFC] dark:bg-[#0B1121] py-12 px-4 sm:px-6">
            
            {/* ─── 1. Ambient Background Orbs (Slow pulse animations) ─── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute top-[-10%] left-[-5%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-[#22c55e]/15 dark:bg-[#22c55e]/20 blur-[120px]" 
                    style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} 
                />
                <div 
                    className="absolute bottom-[-10%] right-[-5%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full bg-blue-500/15 dark:bg-blue-600/20 blur-[120px]" 
                    style={{ animation: 'pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate-reverse' }} 
                />
            </div>

            {/* ─── 2. Subtle Grid Overlay ─── */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.3] dark:opacity-[0.1]" 
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%2394A3B8' /%3E%3C/svg%3E\")" }} 
            />

            {/* ─── 3. Header/Logo (Top Left) ─── */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#10b981] flex items-center justify-center shadow-lg shadow-green-500/25 transition-transform group-hover:scale-105 group-hover:-rotate-3">
                        {/* Custom Modern Premium Vector Logo */}
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9"/>
                            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="text-[#1C252E] dark:text-white font-black text-2xl tracking-tight hidden sm:block font-mono">
                        Recruitment<span className="text-[#22c55e]">Platform</span>
                    </span>
                </Link>
            </div>

            {/* ─── 4. Center Form Container ─── */}
            <div className="relative z-10 w-full flex justify-center mt-12 sm:mt-0">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[480px] lg:max-w-[580px]"
                >
                    {children}
                </motion.div>
            </div>

            {/* ─── 5. Footer (Bottom Center) ─── */}
            <div className="absolute bottom-6 w-full text-center z-20 text-[#64748B] text-xs font-medium">
                &copy; {new Date().getFullYear()} Recruitment Platform. Cổng kết nối sự nghiệp tương lai.
            </div>
            
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
}
