import { Link, useNavigate, useLocation } from "react-router";
import SearchBar from "./SearchBar";
import {
  LoginIcon,
  CartIcon,
  UserIcon,
  LogoutIcon,
  SettingsIcon,
} from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navactions = () => {
  const user = {
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "", // empty for fallback
  };

  const navigate = useNavigate();
  const location = useLocation();

  const isShopPage = location.pathname === "/shop";

  const handleLogout = () => {
    console.log("Logging out...");
    // Mock logout logic here
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-5">
      {/* Search — contains its own trigger button + dropdown panel */}
      {isShopPage && <SearchBar />}
      <ModeToggle />

      {/* Login / Avatar */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 rounded-full overflow-hidden border border-border/50 flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-all outline-none">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-secondary text-[10px] font-bold uppercase text-secondary-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 mt-2 p-2">
            <DropdownMenuLabel className="font-normal px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-[11px] leading-none text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuItem asChild className="px-4 py-2.5 rounded-md cursor-pointer transition-colors">
              <Link to="/profile">
                <UserIcon className="mr-3 h-4 w-4 opacity-70" />
                <span className="text-sm">Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-4 py-2.5 rounded-md cursor-pointer transition-colors">
              <Link to="/orders">
                <CartIcon className="mr-3 h-4 w-4 opacity-70" />
                <span className="text-sm">My Orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="px-4 py-2.5 rounded-md cursor-pointer transition-colors">
              <Link to="/settings">
                <SettingsIcon className="mr-3 h-4 w-4 opacity-70" />
                <span className="text-sm">Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-2" />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive px-4 py-2.5 rounded-md cursor-pointer transition-colors"
              onClick={handleLogout}
            >
              <LogoutIcon className="mr-3 h-4 w-4 opacity-70" />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          to="/login"
          className="p-2 text-foreground/60 hover:text-primary transition-all duration-300 hover:scale-110"
          aria-label="Login"
        >
          <LoginIcon className="w-[18px] h-[18px]" />
        </Link>
      )}

      {/* Cart */}
      <Link
        to="/cart"
        className="p-2 text-foreground/60 hover:text-primary transition-all duration-300 hover:scale-110 relative"
        aria-label="Cart"
      >
        <CartIcon className="w-[20px] h-[20px]" />
      </Link>
    </div>
  );
};

export default Navactions;
