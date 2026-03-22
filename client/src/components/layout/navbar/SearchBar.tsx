import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, CloseIcon } from "@/components/icons";

interface SearchBarProps {
  isInline?: boolean;
}

const SearchBar = ({ isInline = false }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInline) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isInline]);

  useEffect(() => {
    if (open && !isInline) inputRef.current?.focus();
  }, [open, isInline]);

  if (isInline) {
    return (
      <div className="flex items-center gap-3 w-full bg-secondary/30 border border-border/50 rounded-full px-4 py-2.5 outline-none focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
        <SearchIcon className="w-[18px] h-[18px] text-foreground/50 shrink-0" />
        <input
          type="text"
          placeholder="Search products..."
          className="flex-1 bg-transparent text-[15px] font-light text-foreground placeholder:text-foreground/40 outline-none border-none min-w-0"
        />
      </div>
    );
  }

  return (
    <>
      {/* Icon trigger */}
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"
        aria-label="Open search"
      >
        <SearchIcon className="w-[20px] h-[20px]" />
      </button>

      {/* Full-width inline search bar that slides in below navbar */}
      <div
        className={cn(
          "fixed left-0 right-0 bg-background border-b border-border z-[60] transition-all duration-300 ease-in-out overflow-hidden",
          open ? "top-16 opacity-100 h-14" : "top-16 opacity-0 h-0 pointer-events-none"
        )}
        ref={containerRef}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-3">
          <SearchIcon className="w-5 h-5 text-foreground/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            className="flex-1 h-full bg-transparent text-sm text-foreground placeholder:text-foreground/40 outline-none border-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="p-1 text-foreground/40 hover:text-foreground transition-colors"
            aria-label="Close search"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
