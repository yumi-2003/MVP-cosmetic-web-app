import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  MenuIcon,
  CartIcon,
  LogoutIcon,
  UserIcon,
  FavIcon,
} from "@/components/icons";
import SearchBar from "./SearchBar";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, ShieldCheck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { toast } from "sonner";

const navLinks = {
  shop: [
    { label: "Shop All", to: "/shop" },
    { label: "For You", to: "/for-you" },
    { label: "Blog", to: "/blog" },
    { label: "Best Sellers", to: "/best-sellers" },
    { label: "New Arrivals", to: "/new-arrivals" },
  ],
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { categories } = useAppSelector((state) => state.categories || { categories: [] });
  const isShopPage = location.pathname === "/shop";

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    setOpen(false);
    navigate("/login");
  };

  const userInitials = user ? `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase() : "";

  return (
    <div className="lg:hidden flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="p-2 text-foreground/80 hover:text-primary transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <MenuIcon className="w-[22px] h-[22px]" />
          </button>
        </SheetTrigger>

        {/* Removed left border, added subtle shadow, ensure bg handles modes nicely */}
        <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0 flex flex-col z-[100] border-r-border/30 bg-background shadow-2xl">
          
          {/* Header */}
          <SheetHeader className="px-6 h-20 justify-center border-b border-border/20 text-left">
            <SheetTitle asChild>
              <Link
                to="/"
                className="text-xl md:text-2xl tracking-[0.25em] font-light font-serif text-foreground uppercase pt-2"
                onClick={() => setOpen(false)}
              >
                JustaGirl
              </Link>
            </SheetTitle>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-20 px-6 flex flex-col gap-10">
            {/* Search */}
            {isShopPage && (
              <div className="w-full">
                <SearchBar isInline />
              </div>
            )}

            {/* Links Block */}
            <div className="space-y-10">
              <section>
                <div className="flex flex-col gap-5">
                  {navLinks.shop.map(({ label, to }) => (
                    <Link
                      key={to}
                      to={to}
                      className="text-[17px] font-medium tracking-wide text-foreground/90 hover:text-primary transition-colors flex items-center"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs tracking-[0.25em] text-muted-foreground/70 uppercase mb-5 font-medium">
                  Categories
                </h3>
                <div className="flex flex-col gap-5">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      className={`text-[17px] font-light tracking-wide hover:text-primary transition-colors flex items-center ${
                        location.pathname === `/category/${cat.slug}`
                          ? "text-primary font-medium"
                          : "text-foreground/80"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
            
            <div className="flex-1" /> {/* Spacer */}

            {/* Footer Actions */}
            <div className="space-y-8 pt-8 border-t border-border/20">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-wide text-muted-foreground">Appearance</span>
                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/40">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-1.5 rounded-full transition-all ${
                      theme === "light"
                        ? "bg-background shadow-xs text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`p-1.5 rounded-full transition-all ${
                      theme === "dark"
                        ? "bg-background shadow-xs text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Auth */}
              {user ? (
                <div className="flex items-center justify-between bg-secondary/20 p-3 rounded-2xl border border-border/30">
                  <div className="flex items-center gap-3">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.firstname} className="w-10 h-10 rounded-full object-cover border border-primary/20" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm border border-primary/20">
                        {userInitials}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium leading-none mb-1">{user.firstname} {user.lastname}</span>
                      <Link
                        to="/profile"
                        className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center mt-0.5"
                        onClick={() => setOpen(false)}
                      >
                        <UserIcon className="w-3 h-3 mr-1" /> View Profile
                      </Link>
                      {user?.isAdmin && (
                        <Link
                          to="/admin"
                          className="text-[11px] text-primary hover:opacity-80 transition-opacity flex items-center mt-1 font-semibold"
                          onClick={() => setOpen(false)}
                        >
                          <ShieldCheck className="w-3 h-3 mr-1" /> Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/favorites"
                        className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center mt-1"
                        onClick={() => setOpen(false)}
                      >
                        <FavIcon className="w-3 h-3 mr-1" /> Favorites
                      </Link>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                    aria-label="Logout"
                  >
                    <LogoutIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center py-3 font-bold tracking-widest text-[11px] uppercase rounded-full hover:opacity-90 transition-colors shadow-sm"
                    style={{ 
                      backgroundColor: theme === "dark" ? "#FFFFFF" : "#000000",
                      color: theme === "dark" ? "#000000" : "#FFFFFF" 
                    }}
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex w-full items-center justify-center py-3 border border-border bg-background text-foreground font-bold tracking-widest text-[11px] uppercase rounded-full hover:bg-secondary transition-colors shadow-sm"
                    onClick={() => setOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
