import { Link } from "react-router";

const navLinks = [
  { label: "SHOP ALL", to: "/shop" },
  { label: "SKINCARE", to: "/category/skincare" },
  { label: "MAKEUP", to: "/category/makeup" },
];

const DesktopNav = () => {
  return (
    <nav className="hidden lg:flex gap-8 text-sm tracking-widest font-normal text-foreground/80">
      {navLinks.map(({ label, to }) => (
        <Link
          key={to}
          to={to}
          className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:after:w-full hover:text-foreground transition-colors duration-200"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNav;
