import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex h-9 w-16 cursor-pointer items-center rounded-full px-1 transition-all duration-500 ease-in-out outline-none overflow-hidden",
        "border border-white/20 hover:border-white/40 shadow-lg",
        isDark ? "bg-card" : "bg-muted"
      )}
      aria-label="Toggle theme"
    >
      {/* Track Background Highlights */}
      <div className={cn(
        "absolute inset-0 rounded-full opacity-30 transition-opacity duration-500",
        isDark ? "bg-primary/20" : "bg-primary/10"
      )} />
      
      {/* Toggle Knob - Explicit high contrast bg */}
      <div
        className={cn(
          "z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isDark 
            ? "translate-x-7 rotate-0 bg-secondary text-primary" 
            : "translate-x-0 -rotate-180 bg-background text-primary"
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </div>

      {/* Decorative Icons In Track - Fixed for visibility */}
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-3 h-3">
        <Sun className={cn(
          "h-full w-full text-primary transition-all duration-500", 
          isDark ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )} />
      </div>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-3 h-3">
        <Moon className={cn(
          "h-full w-full text-secondary transition-all duration-500", 
          !isDark ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )} />
      </div>
    </button>
  );
}
