import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Shield, 
  ShieldCheck, 
  UserMinus, 
  Edit3,
  MoreVertical,
  UserPlus
} from "lucide-react";
import api from "../../redux/api";
import type { IUser } from "../../redux/types";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (id: string, isAdmin: boolean) => {
    try {
      await api.put(`/admin/users/${id}`, { isAdmin: !isAdmin });
      setUsers(users.map(u => u._id === id ? { ...u, isAdmin: !isAdmin } : u));
    } catch (error) {
      alert("Failed to update user role");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstname} ${u.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            User <span className="text-primary text-xl align-top">Management</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage permissions and monitor user activity.
          </p>
        </div>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4 text-center">Avatar</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4 text-center">Role</th>
                <th className="px-6 py-4 text-center">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-accent/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-primary/20 group-hover:scale-110 transition-transform">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.firstname || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          (user.firstname?.[0] || user.email?.[0] || '?').toUpperCase()
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail size={14} className="text-primary" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {user.isAdmin ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                          <ShieldCheck size={12} />
                          Admin
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-muted-foreground border border-border/50">
                          <Shield size={12} />
                          User
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                        title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                        className="p-2 border border-border bg-background rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        {user.isAdmin ? <UserMinus size={16} /> : <UserPlus size={16} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        title="Delete User"
                        className="p-2 border border-border bg-background rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all"
                      >
                        <UserMinus size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
