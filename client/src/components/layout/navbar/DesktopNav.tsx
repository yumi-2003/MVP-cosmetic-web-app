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
    <nav className="hidden lg:flex items-center gap-8 text-[11px] tracking-[0.25em] font-medium text-foreground/70 uppercase">
      {/* Shop All */}
      <Link
        to="/shop"
        className={`relative py-1 after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-500 hover:after:w-full hover:text-foreground transition-colors duration-300 ${
          isActivePath("/shop") ? "text-foreground after:w-full" : ""
        }`}
      >
        Shop All
      </Link>

      {/* Categories Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`flex items-center gap-1 py-1 relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-primary after:transition-all after:duration-500 hover:text-foreground transition-colors duration-300 ${
            isActivePath("/category") ? "text-foreground after:w-full" : "after:w-0 hover:after:w-full"
          }`}
        >
          Categories
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown panel */}
        {open && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-52 bg-background border border-border/60 rounded-2xl shadow-xl shadow-black/10 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Arrow tip */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-background border-t border-l border-border/60 rotate-45 rounded-sm" />

            {categories.length === 0 ? (
              <div className="px-3 py-4 text-center text-[10px] text-muted-foreground tracking-widest">
                Loading...
              </div>
            ) : (
              <ul className="relative z-10">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] tracking-[0.15em] uppercase transition-all duration-200 ${
                        location.pathname === `/category/${cat.slug}`
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/70 hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span className="text-primary/60 text-base leading-none">
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
    </nav>
  );
};

export default DesktopNav;
