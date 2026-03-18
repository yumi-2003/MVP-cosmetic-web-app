import { Link } from "react-router";
import SearchBar from "./SearchBar";
import { LoginIcon, CartIcon } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";

const Navactions = () => {
  const user = null;

  return (
    <div className="flex items-center gap-1">
      {/* Search — contains its own trigger button + dropdown panel */}
      <SearchBar />
      <ModeToggle />

      {/* Login / Avatar */}
      {user ? (
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
          {/* avatar image would go here */}
        </div>
      ) : (
        <Link
          to="/login"
          className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Login"
        >
          <LoginIcon className="w-[20px] h-[20px]" />
        </Link>
      )}

      {/* Cart */}
      <Link
        to="/cart"
        className="p-1.5 text-foreground/70 hover:text-foreground transition-colors relative"
        aria-label="Cart"
      >
        <CartIcon className="w-[20px] h-[20px]" />
      </Link>
    </div>
  );
};

export default Navactions;
