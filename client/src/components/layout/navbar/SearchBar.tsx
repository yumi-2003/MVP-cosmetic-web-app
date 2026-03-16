import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, CloseIcon } from "@/components/icons";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

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
          "fixed left-0 right-0 bg-white border-b z-[60] transition-all duration-300 ease-in-out overflow-hidden",
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
