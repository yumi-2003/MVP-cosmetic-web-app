import { Link } from "react-router";
import DesktopNav from "./DesktopNav";
import Navactions from "./Navactions";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <header className="relative z-50 border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-between h-16">
        {/* logo  */}
        <Link to="/" className="text-xl tracking-widest font-light">
          JustaGirl
        </Link>

        {/* desktop navigation  */}
        <div className="hidden md:block">
          <DesktopNav />
        </div>
        {/* actions */}
        <Navactions />

        {/* mobile nav  */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
