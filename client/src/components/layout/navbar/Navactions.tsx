import { Link, useNavigate } from "react-router";
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

  const handleLogout = () => {
    console.log("Logging out...");
    // Mock logout logic here
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-3">
      {/* Search — contains its own trigger button + dropdown panel */}
      <SearchBar />
      <ModeToggle />

      {/* Login / Avatar */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-8 h-8 rounded-full overflow-hidden border border-border flex items-center justify-center hover:opacity-80 transition-opacity outline-none">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-muted text-xs font-medium uppercase text-muted-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/orders" className="cursor-pointer">
                <CartIcon className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogoutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
