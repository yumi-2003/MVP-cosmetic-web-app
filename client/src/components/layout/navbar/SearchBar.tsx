import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/utils";
import { SearchIcon, CloseIcon } from "@/components/icons";

interface SearchBarProps {
  isInline?: boolean;
}

const SearchBar = ({ isInline = false }: SearchBarProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products } = useAppSelector(
    (state) => state.products || { items: [] }
  );

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

  useEffect(() => {
    const current = searchParams.get("q") || "";
    setQuery(current);
  }, [searchParams]);

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    return (products || []).filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const category =
        typeof product.category === "string"
          ? product.category.toLowerCase()
          : product.category?.name?.toLowerCase() || "";
      const skinTypes = (product.skinTypes || [])
        .map((t) => t.toLowerCase())
        .join(" ");
      const concerns = (product.concerns || [])
        .map((c) => c.toLowerCase())
        .join(" ");

      return (
        name.includes(term) ||
        category.includes(term) ||
        skinTypes.includes(term) ||
        concerns.includes(term)
      );
    });
  }, [products, query]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams, { replace: true });
  };

  if (isInline) {
    return (
      <div className="relative">
        <div className="flex items-center gap-3 w-full bg-secondary/30 border border-border/50 rounded-full px-4 py-2.5 outline-none focus-within:ring-1 focus-within:ring-primary/30 transition-shadow">
        <SearchIcon className="w-[18px] h-[18px] text-foreground/50 shrink-0" />
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="flex-1 bg-transparent text-[15px] font-light text-foreground placeholder:text-foreground/40 outline-none border-none min-w-0"
        />
        </div>
        {query.trim().length > 0 && (
          <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border/60 bg-background shadow-lg overflow-hidden">
            <div className="max-h-72 overflow-y-auto">
              {matches.length > 0 ? (
                matches.slice(0, 8).map((product) => {
                  const category =
                    typeof product.category === "string"
                      ? product.category
                      : product.category?.name || "Uncategorized";
                  return (
                    <button
                      key={product._id}
                      onClick={() => handleQueryChange(product.name)}
                      className="w-full text-left px-4 py-3 hover:bg-accent/40 transition-colors flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-md bg-secondary border border-border/40 overflow-hidden shrink-0">
                        <img
                          src={product.images?.[0] || "https://via.placeholder.com/64"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {category}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                  No matches found.
                </div>
              )}
            </div>
          </div>
        )}
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
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-3 relative">
          <SearchIcon className="w-5 h-5 text-foreground/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
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
      {open && query.trim().length > 0 && (
        <div className="fixed left-0 right-0 top-[104px] z-[59] bg-background border-b border-border shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="max-h-72 overflow-y-auto rounded-xl border border-border/60">
              {matches.length > 0 ? (
                matches.slice(0, 8).map((product) => {
                  const category =
                    typeof product.category === "string"
                      ? product.category
                      : product.category?.name || "Uncategorized";
                  return (
                    <button
                      key={product._id}
                      onClick={() => {
                        handleQueryChange(product.name);
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-accent/40 transition-colors flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-md bg-secondary border border-border/40 overflow-hidden shrink-0">
                        <img
                          src={product.images?.[0] || "https://via.placeholder.com/64"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {category}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                  No matches found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
