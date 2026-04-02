import React, { useEffect, useState, useCallback } from "react";
import { 
  User as UserIcon, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  Package,
  ArrowRight
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
import api from "@/redux/api";

interface INotification {
  _id: string;
  message: string;
  type: "order" | "user" | "inventory";
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

const AdminHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get("/admin/notifications");
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: INotification) => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.patch(`/admin/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/admin/notifications/read-all");
      fetchNotifications();
      toast.success("Notifications cleared.");
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
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
            placeholder="Search..." 
            className="h-12 w-80 rounded-2xl border border-border bg-muted/20 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-3 rounded-2xl hover:bg-muted transition-all group overflow-visible">
              <Bell size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background animate-in zoom-in duration-300">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[400px] p-0 rounded-3xl border-border/50 bg-card/80 backdrop-blur-2xl shadow-2xl mt-2 animate-in fade-in-0 zoom-in-95 overflow-hidden">
            <div className="p-6 border-b border-border/40 flex items-center justify-between bg-primary/5">
              <div>
                <h3 className="text-lg font-bold tracking-tight">Notifications</h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Stay updated on recent activity.</p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/40">
                    <Bell size={32} />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">No notifications today</p>
                </div>
              ) : (
                <div className="divide-y divide-border/20">
                  {notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`p-5 flex gap-4 transition-all hover:bg-muted/30 group relative ${!notif.isRead ? 'bg-primary/[0.03]' : ''}`}
                    >
                      <div className={`mt-1 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
                        notif.type === 'order' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Package size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm tracking-tight leading-relaxed ${!notif.isRead ? 'font-bold' : 'text-muted-foreground font-medium'}`}>
                            {notif.message}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                            <Clock size={12} />
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {notif.relatedId && (
                            <Link 
                               to={`/admin/orders?search=${notif.relatedId}`}
                               className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline group-hover:translate-x-1 transition-transform"
                            >
                              Inspect <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <button 
                          onClick={(e) => markAsRead(notif._id, e)}
                          className="p-2 h-fit text-muted-foreground/40 hover:text-primary transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <DropdownMenuSeparator className="m-0 bg-border/40" />
            <Link 
              to="/admin/orders" 
              className="block p-4 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-muted/30 transition-all"
            >
              View All Orders
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

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
                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Administrator</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-3 rounded-3xl border-border/50 bg-card/80 backdrop-blur-2xl shadow-2xl mt-2 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-4">
            <DropdownMenuLabel className="px-3 py-4">
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Admin Session</span>
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
