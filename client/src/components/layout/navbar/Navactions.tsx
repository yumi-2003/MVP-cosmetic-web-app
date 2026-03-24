import { Link, useNavigate, useLocation } from "react-router";
import SearchBar from "./SearchBar";
import {
  LoginIcon,
  UserIcon,
  LogoutIcon,
  SettingsIcon,
} from "@/components/icons";
import { Package } from "lucide-react";
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { clearCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";
import CartButton from "./CartButton";

const Navactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart || { items: [] });

  const totalItems = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const isShopPage = location.pathname === "/shop";

  const handleLogout = () => {
    dispatch(logout());
    // Clear cart state immediately
    dispatch(clearCart());

    // Rotate guest session ID so the next guest cart is empty
    localStorage.removeItem("x-session-id");

    toast.success("Logged out successfully. See you soon!");
    navigate("/login");
  };

  const userFullName = user ? `${user.firstname} ${user.lastname}` : "";
  const userInitials = user
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()
    : "";

  return (
    <div className="flex items-center gap-5">
      {/* Search — contains its own trigger button + dropdown panel */}
      {isShopPage && <SearchBar />}
      <ModeToggle />

      {/* Authentication & User Profile */}
      {!user ? (
        <Link
          to="/login"
          className="relative text-foreground/80 hover:text-primary transition-colors p-2"
          aria-label="Login"
        >
          <LoginIcon className="w-5 h-5" />
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative w-9 h-9 rounded-full overflow-hidden border border-border/50 flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-all outline-none">
              <Avatar className="w-9 h-9">
                <AvatarImage src={""} alt={userFullName} />
                <AvatarFallback className="bg-secondary text-[10px] font-bold uppercase text-secondary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 mt-2 p-2">
            <DropdownMenuLabel className="font-normal px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">
                  {userFullName}
                </p>
                <p className="text-[11px] leading-none text-muted-foreground mt-1">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2.5">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer py-2.5"
              onClick={() => navigate("/orders")}
            >
              <Package className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2.5">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive py-2.5"
              onClick={handleLogout}
            >
              <LogoutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Cart with Dynamic Badge & Enhancement */}
      <CartButton />
    </div>
  );
};

export default Navactions;
