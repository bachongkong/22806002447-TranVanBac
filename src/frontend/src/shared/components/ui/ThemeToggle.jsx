import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export function ThemeToggle({ className }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial theme from document class or localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <button
        className={cn(
          "relative p-2 rounded-full transition-colors",
          "bg-slate-100 dark:bg-slate-800",
          "hover:bg-slate-200 dark:hover:bg-slate-700",
          className
        )}
      >
        <span className="w-5 h-5 block" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-full transition-all duration-300",
        "bg-slate-100 dark:bg-slate-800",
        "hover:bg-slate-200 dark:hover:bg-slate-700",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        "dark:focus:ring-offset-slate-900",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun
        className={cn(
          "w-5 h-5 transition-all duration-300",
          "text-amber-500",
          isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        )}
      />
      <Moon
        className={cn(
          "absolute top-2 left-2 w-5 h-5 transition-all duration-300",
          "text-slate-400",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
        )}
      />
    </button>
  );
}
