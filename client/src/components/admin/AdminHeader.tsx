import React from "react";
import { 
  User as UserIcon, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Bell,
  Search
} from "lucide-react";
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
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const AdminHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Identity Secured. Logged out of vault.");
    navigate("/login");
  };

  const userInitials = user
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-30 flex h-24 w-full items-center justify-between border-b border-border/40 bg-background/60 px-10 backdrop-blur-2xl">
      <div className="flex items-center gap-6">
        <div className="relative group max-md:hidden">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search vault..." 
            className="h-12 w-80 rounded-2xl border border-border bg-muted/20 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button className="relative p-3 rounded-2xl hover:bg-muted transition-all group overflow-hidden">
          <Bell size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background animate-pulse" />
        </button>

        <div className="h-10 w-[1px] bg-border/40" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-4 py-2 px-3 rounded-2xl hover:bg-muted/50 transition-all group outline-none">
              <Avatar className="h-11 w-11 border-2 border-primary/20 group-hover:border-primary transition-colors duration-500 shadow-xl shadow-black/5">
                <AvatarImage src={user?.profileImage || ""} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start max-md:hidden">
                <span className="text-sm font-bold text-foreground leading-tight">{user?.firstname} {user?.lastname}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Master Curator</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-3 rounded-3xl border-border/50 bg-card/80 backdrop-blur-2xl shadow-2xl mt-2 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-4">
            <DropdownMenuLabel className="px-3 py-4">
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Administrative Session</span>
                <p className="text-sm font-bold text-foreground mt-1 truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/40" />
            
            <DropdownMenuItem asChild className="cursor-pointer py-3.5 px-4 rounded-xl focus:bg-primary/5 focus:text-primary transition-all group">
              <Link to="/admin" className="flex items-center w-full">
                <LayoutDashboard className="mr-3 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm tracking-tight">Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild className="cursor-pointer py-3.5 px-4 rounded-xl focus:bg-primary/5 focus:text-primary transition-all group">
              <Link to="/profile" className="flex items-center w-full">
                <Settings className="mr-3 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm tracking-tight">Profile Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border/40" />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer py-3.5 px-4 rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive transition-all group"
            >
              <LogOut className="mr-3 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm tracking-tight text-destructive">Secure Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
