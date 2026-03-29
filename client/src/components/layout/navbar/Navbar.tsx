import { Link } from "react-router";
import DesktopNav from "./DesktopNav";
import Navactions from "./Navactions";
import MobileNav from "./MobileNav";
import CartButton from "./CartButton";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center px-4 sm:px-6 lg:grid lg:h-24 lg:grid-cols-[auto_1fr_auto] lg:gap-10 lg:px-8">
        {/* Mobile Hamburger (Left on mobile) */}
        <div className="flex-1 lg:hidden">
          <MobileNav />
        </div>

        {/* Logo */}
        <div className="flex flex-1 justify-center lg:flex-none lg:justify-start lg:pr-6">
          <Link
            to="/"
            className="font-serif text-2xl font-extralight uppercase tracking-[0.34em] text-foreground transition-all duration-500 hover:opacity-80 md:text-[28px] lg:tracking-[0.38em]"
          >
            JustaGirl
          </Link>
        </div>

        {/* Desktop navigation — centered */}
        <div className="hidden min-w-0 justify-center lg:flex">
          <DesktopNav />
        </div>

        {/* Actions — Right aligned */}
        <div className="flex flex-1 items-center justify-end gap-2 sm:pl-4 lg:flex-none lg:pl-0">
          <div className="hidden lg:flex">
            <Navactions />
          </div>
          <div className="flex lg:hidden">
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
