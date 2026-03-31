import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ListTree,
  ShoppingBag,
  Users,
  BookOpen,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: ListTree, label: "Categories", path: "/admin/categories" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BookOpen, label: "Blogs", path: "/admin/blogs" },
];
interface AdminSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isMobile, onClose }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-64 min-h-screen sticky top-0'} bg-card border-r border-border flex flex-col h-screen overflow-y-auto`}>
      <div className="p-6 border-b border-border mb-4">
        <Link to="/" className="flex items-center gap-2 group" onClick={onClose}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-110 transition-transform">
            Y
          </div>
          <span className="font-bold text-xl tracking-tight">
            YUMI <span className="text-primary">ADMIN</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 translate-x-1"
                  : "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 w-full p-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
