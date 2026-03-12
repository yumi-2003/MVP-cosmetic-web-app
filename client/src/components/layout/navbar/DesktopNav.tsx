import { Link } from "react-router";

const DesktopNav = () => {
  return (
    <nav className="flex gap-8 text-sm tracking-wider">
      <Link to="/shop" className="hover:underline">
        SHOP ALL
      </Link>
      <Link to="/category/skincare" className="hover:underline">
        SKINCARE
      </Link>
      <Link to="/category/makeup" className="hover:underline">
        MAKEUP
      </Link>
    </nav>
  );
};

export default DesktopNav;
