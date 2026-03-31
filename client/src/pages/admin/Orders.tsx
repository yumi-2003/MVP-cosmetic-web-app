import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Filter,
  MoreVertical,
  Calendar
} from "lucide-react";
import api from "../../redux/api";
import type { IOrder } from "../../redux/types";

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/admin/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${id}`, { status: newStatus });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus as any } : o));
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter(o => {
    const customerName = typeof o.user === 'object' ? `${o.user?.firstname} ${o.user?.lastname}`.toLowerCase() : '';
    const matchesSearch = customerName.includes(searchTerm.toLowerCase()) || o._id.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Order <span className="text-primary text-xl align-top">Management</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track and manage your customer orders.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by order ID or customer..." 
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="px-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm min-w-[150px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="max-md:flex-1 p-3 border border-border bg-card rounded-2xl hover:bg-accent transition-all shadow-sm flex items-center gap-2">
            <Calendar size={20} />
            <span className="md:hidden">Select Date</span>
          </button>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-accent/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">{order.items.length} items</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {typeof order.user === 'object' ? (
                      <div className="flex flex-col">
                        <span className="font-medium">{order.user?.firstname} {order.user?.lastname}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{order.user?.email}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Registered User</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-primary/20 text-primary' :
                        order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                        'bg-secondary/30 text-secondary-foreground'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <select 
                        title="Update Status"
                        className="p-2 border border-border bg-background rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        <option value="placed">Placed</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button className="p-2 border border-border bg-background rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                        <Eye size={16} />
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

export default AdminOrders;
