import { Link } from "react-router";
import DesktopNav from "./DesktopNav";
import Navactions from "./Navactions";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center h-16 relative">
        {/* Mobile Hamburger (Left on mobile) */}
        <div className="flex-1 lg:hidden">
          <MobileNav />
        </div>

        {/* Logo */}
        <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
          <Link
            to="/"
            className="text-2xl tracking-[0.25em] font-light text-foreground select-none uppercase"
            style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
          >
            JustaGirl
          </Link>
        </div>

        {/* Desktop navigation — centered */}
        <div className="flex-1 hidden lg:flex justify-center absolute left-1/2 -translate-x-1/2">
          <DesktopNav />
        </div>

        {/* Actions — Right aligned */}
        <div className="flex-1 flex justify-end">
          <Navactions />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
