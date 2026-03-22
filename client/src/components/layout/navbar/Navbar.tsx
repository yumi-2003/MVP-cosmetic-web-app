import { Link } from "react-router";
import DesktopNav from "./DesktopNav";
import Navactions from "./Navactions";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center h-20 relative">
        {/* Mobile Hamburger (Left on mobile) */}
        <div className="flex-1 lg:hidden">
          <MobileNav />
        </div>

        {/* Logo */}
        <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
          <Link
            to="/"
            className="text-2xl md:text-3xl tracking-[0.3em] font-light font-serif text-foreground select-none uppercase transition-opacity hover:opacity-80"
          >
            JustaGirl
          </Link>
        </div>

        {/* Desktop navigation — centered */}
        <div className="flex-1 hidden lg:flex justify-center absolute left-1/2 -translate-x-1/2">
          <DesktopNav />
        </div>

        {/* Actions — Right aligned */}
        <div className="flex-1 flex justify-end items-center sm:pl-4">
          <div className="hidden lg:flex">
            <Navactions />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
