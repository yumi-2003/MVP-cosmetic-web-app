import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  MenuIcon,
  XIcon,
  CartIcon,
  LogoutIcon,
  ArrowRightIcon,
} from "@/components/icons";
import SearchBar from "./SearchBar";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

const navLinks = {
  shop: [
    { label: "SHOP ALL", to: "/shop" },
    { label: "BEST SELLERS", to: "/best-sellers" },
    { label: "NEW ARRIVALS", to: "/new-arrivals" },
  ],
  categories: [
    { label: "SKINCARE", to: "/category/skincare" },
    { label: "MAKEUP", to: "/category/makeup" },
    { label: "HAIRCARE", to: "/category/haircare" },
  ],
  help: [
    { label: "OUR STORY", to: "/our-story" },
    { label: "SHIPPING & RETURNS", to: "/shipping" },
    { label: "CONTACT US", to: "/contact" },
  ],
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const user = {
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "", // empty for fallback
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setOpen(false);
    navigate("/login");
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"
        aria-label="Open menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-background z-[100] transition-transform duration-300 ease-in-out transform ${
          open ? "translate-x-0" : "translate-x-full"
        } flex flex-col overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border/40">
          <Link
            to="/"
            className="text-xl tracking-[0.2em] font-light font-serif text-foreground uppercase"
            onClick={() => setOpen(false)}
          >
            JustaGirl
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-8 flex flex-col gap-10">
          {/* Search */}
          <div className="w-full">
            <SearchBar />
          </div>

          {/* Navigation */}
          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-4">
                Shop
              </h3>
              <nav className="flex flex-col gap-4">
                {navLinks.shop.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-lg font-light tracking-wide text-foreground hover:text-primary transition-colors flex items-center justify-between"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                    <ArrowRightIcon className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
              </nav>
            </section>

            <section>
              <h3 className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-4">
                Categories
              </h3>
              <nav className="flex flex-col gap-4">
                {navLinks.categories.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-lg font-light tracking-wide text-foreground hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </section>
          </div>

          {/* Settings / Theme Toggle */}
          <section className="pt-6 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-sm font-light tracking-wide">Theme</span>
              <div className="flex p-1 bg-muted rounded-full">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-2 rounded-full transition-all ${
                    theme === "light"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-2 rounded-full transition-all ${
                    theme === "dark"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Account */}
          <section className="mt-auto py-8">
            {user ? (
              <div className="bg-muted/30 p-4 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-lg border border-primary/20">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/profile"
                    className="p-2.5 text-center text-xs bg-background border border-border rounded-lg"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-center text-xs bg-destructive/10 text-destructive rounded-lg flex items-center justify-center gap-2"
                  >
                    <LogoutIcon className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full py-4 text-center bg-foreground text-background font-medium tracking-widest text-sm"
                  onClick={() => setOpen(false)}
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  className="w-full py-4 text-center border border-foreground font-medium tracking-widest text-sm"
                  onClick={() => setOpen(false)}
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
