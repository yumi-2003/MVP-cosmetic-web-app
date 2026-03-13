import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
    <div ref={containerRef} className="relative flex items-center h-10">
      {/* Static Search Icon (Trigger) */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "p-2 transition-opacity duration-200",
          open ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Expanding Search Bar */}
      <div
        className={cn(
          "absolute right-0 flex items-center bg-background border rounded-full transition-all duration-300 ease-in-out shadow-sm",
          open
            ? "w-[50vw] md:w-[320px] opacity-100 px-3 py-1 z-20"
            : "w-0 opacity-0 pointer-events-none border-none",
        )}
      >
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          ref={inputRef}
          className="border-none shadow-none focus-visible:ring-0 h-8 text-base"
          placeholder="Search..."
        />
        <button onClick={() => setOpen(false)} className="shrink-0">
          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
