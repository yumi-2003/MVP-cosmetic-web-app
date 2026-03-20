import { Link } from "react-router";

const navLinks = [
  { label: "SHOP ALL", to: "/shop" },
  { label: "SKINCARE", to: "/category/skincare" },
  { label: "MAKEUP", to: "/category/makeup" },
];

const DesktopNav = () => {
  return (
    <nav className="hidden lg:flex gap-10 text-[11px] tracking-[0.25em] font-medium text-foreground/70 uppercase">
      {navLinks.map(({ label, to }) => (
        <Link
          key={to}
          to={to}
          className="relative py-1 after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-500 hover:after:w-full hover:text-foreground transition-colors duration-300"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNav;
