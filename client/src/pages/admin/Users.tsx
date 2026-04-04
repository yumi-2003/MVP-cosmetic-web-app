import React, { useEffect, useState, useRef } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Shield, 
  ShieldCheck, 
  UserMinus, 
  UserPlus,
  ShieldAlert,
  Clock
} from "lucide-react";
import api from "../../redux/api";
import type { IUser } from "../../redux/types";
import Pagination from "../../components/ui/Pagination";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { toast } from "sonner";

const AdminUsers: React.FC = () => {
  // Data State
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Ensure currentPage is passed as a number
      const response = await api.get(`/admin/users`, {
        params: {
          page: currentPage,
          limit: limit,
          search: searchTerm
        }
      });

      if (response.data && response.data.data) {
        setUsers(response.data.data);
        setTotalPages(Number(response.data.totalPages) || 1);
      } else {
        // Fallback for non-paginated legacy response if any
        setUsers(Array.isArray(response.data) ? response.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Scroll table into view on page change
    if (currentPage > 1 && tableRef.current) {
        tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage, searchTerm]);

  const handleToggleAdmin = async (id: string, isAdmin: boolean) => {
    try {
      await api.put(`/admin/users/${id}`, { isAdmin: !isAdmin });
      toast.success(isAdmin ? "Admin role removed" : "Admin role granted");
      fetchData();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        toast.success("User deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  if (loading && users.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            User <span className="text-primary italic">Management</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Manage user roles, permissions, and accounts.
          </p>
        </div>
      </div>

      <div className="relative group max-w-2xl" ref={tableRef}>
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={24} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full pl-16 pr-8 py-5 bg-card border border-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm text-xl"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-6">User</th>
                <th className="px-8 py-6">Email Address</th>
                <th className="px-8 py-6">Role / Status</th>
                <th className="px-8 py-6">Joined Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {users.length === 0 ? (
                <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground italic">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-primary/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20 group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-black/5 overflow-hidden">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.firstname} className="w-full h-full object-cover" />
                            ) : (
                              (user.firstname?.[0] || user.email?.[0] || '?').toUpperCase()
                            )}
                          </div>
                          {user.isAdmin && (
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full shadow-lg border-2 border-card">
                              <ShieldCheck size={12} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{user.firstname} {user.lastname}</span>
                          <span className="text-[10px] text-muted-foreground/60 font-mono tracking-tighter uppercase">ID: {user._id.slice(-8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full w-fit">
                        <Mail size={14} className="text-primary" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-start">
                        {user.isAdmin ? (
                          <span className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/20 shadow-sm shadow-primary/5">
                            <ShieldAlert size={14} />
                            Administrator
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-muted/40 text-muted-foreground border border-border/50">
                            <Shield size={14} />
                            Customer
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <Clock size={16} className="text-primary" />
                        {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                          title={user.isAdmin ? "Remove Admin Role" : "Make Admin"}
                          className="p-3 border border-border bg-card rounded-2xl hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 shadow-sm"
                        >
                          {user.isAdmin ? <UserMinus size={18} /> : <UserPlus size={18} />}
                        </button>
                        {!user.isAdmin && (
                          <button 
                            onClick={() => handleDelete(user._id)}
                            title="Delete User"
                            className="p-3 border border-border bg-card rounded-2xl hover:bg-destructive hover:text-destructive-foreground hover:shadow-xl hover:shadow-destructive/20 transition-all duration-300 shadow-sm"
                          >
                            <UserMinus size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-border/10 bg-muted/5 p-6">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
