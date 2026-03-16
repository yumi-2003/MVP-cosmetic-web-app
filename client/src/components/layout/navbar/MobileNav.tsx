import { useState } from "react";
import { Link } from "react-router";
import { MenuIcon, XIcon, LoginIcon, CartIcon } from "@/components/icons";
import SearchBar from "./SearchBar";

const navLinks = [
  { label: "SHOP ALL", to: "/shop" },
  { label: "SKINCARE", to: "/category/skincare" },
  { label: "MAKEUP", to: "/category/makeup" },
];

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden flex items-center">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <XIcon className="w-5 h-5" />
        ) : (
          <MenuIcon className="w-5 h-5" />
        )}
      </button>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 top-16 bg-white z-50 flex flex-col px-6 pt-8 gap-6">
          <nav className="flex flex-col gap-6 text-sm tracking-widest font-normal border-b pb-8">
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6 pt-2">
            {/* Search */}
            <SearchBar />
            {/* Login */}
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              <LoginIcon className="w-5 h-5" />
              <span className="sr-only">Login</span>
            </Link>
            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              <CartIcon className="w-5 h-5" />
              <span className="sr-only">Cart</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
