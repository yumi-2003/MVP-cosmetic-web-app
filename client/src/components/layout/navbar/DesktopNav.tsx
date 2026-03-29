import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { ChevronDown } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  skincare: "✦",
  makeup: "✿",
  haircare: "◈",
  bodycare: "◉",
  fragrance: "❋",
};

const DesktopNav = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { categories } = useAppSelector((state) => state.categories || { categories: [] });

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories once
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Close dropdown on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActivePath = (prefix: string) => location.pathname.startsWith(prefix);

  return (
    <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[10px] tracking-[0.22em] font-semibold text-foreground/65 uppercase">
      {/* Shop All */}
      <Link
        to="/shop"
        className={`relative px-1 py-1 transition-all duration-300 hover:text-foreground ${
          isActivePath("/shop") ? "text-foreground" : ""
        }`}
      >
        Shop All
        <span 
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-500 origin-center ${
            isActivePath("/shop") ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        />
      </Link>

      {/* Categories Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`flex items-center gap-1.5 px-1 py-1 transition-all duration-300 hover:text-foreground ${
            isActivePath("/category") ? "text-foreground" : ""
          }`}
        >
          Categories
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
          />
          <span 
            className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-500 origin-center ${
              isActivePath("/category") ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-56 bg-background/95 backdrop-blur-xl border border-border/40 rounded-3xl shadow-2xl shadow-primary/5 p-2 z-50 animate-in fade-in slide-in-from-top-4 duration-500 zoom-in-95">
            {/* Arrow tip - stylized */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-t border-l border-border/40 rotate-45 rounded-sm" />

            {categories.length === 0 ? (
              <div className="px-3 py-6 text-center text-[9px] text-muted-foreground tracking-widest uppercase">
                Discovering...
              </div>
            ) : (
              <ul className="relative z-10 space-y-1">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-[1.2rem] text-[10px] tracking-[0.2em] uppercase transition-all duration-300 group ${
                        location.pathname === `/category/${cat.slug}`
                          ? "bg-primary/5 text-primary font-bold"
                          : "text-foreground/60 hover:bg-primary/[0.03] hover:text-foreground"
                      }`}
                    >
                      <span className={`text-sm transition-transform duration-300 group-hover:scale-110 ${
                        location.pathname === `/category/${cat.slug}` ? "text-primary" : "text-primary/40"
                      }`}>
                        {CATEGORY_ICONS[cat.slug] ?? "◆"}
                      </span>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <Link
        to="/for-you"
        className={`relative px-1 py-1 transition-all duration-300 hover:text-foreground ${
          isActivePath("/for-you") ? "text-foreground" : ""
        }`}
      >
        For You
        <span 
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-500 origin-center ${
            isActivePath("/for-you") ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        />
        {/* Special indicator for "For You" */}
        {!isActivePath("/for-you") && (
          <span className="absolute -top-1.5 -right-2 w-1 h-1 bg-primary rounded-full animate-pulse opacity-60" />
        )}
      </Link>

      <Link
        to="/blog"
        className={`relative px-1 py-1 transition-all duration-300 hover:text-foreground ${
          isActivePath("/blog") ? "text-foreground" : ""
        }`}
      >
        Blog
        <span 
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-500 origin-center ${
            isActivePath("/blog") ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
        />
      </Link>
    </nav>
  );
};

export default DesktopNav;
