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
  Calendar,
  CreditCard,
  User as UserIcon,
  ChevronRight,
  PackageCheck
} from "lucide-react";
import api from "../../redux/api";
import type { IOrder } from "../../redux/types";
import Pagination from "../../components/ui/Pagination";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { toast } from "sonner";

const AdminOrders: React.FC = () => {
  // Data State
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/orders?page=${currentPage}&limit=${limit}&search=${searchTerm}&status=${statusFilter}`);
      if (response.data.data) {
        setOrders(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        // Fallback for non-paginated legacy response if any
        setOrders(Array.isArray(response.data) ? response.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Failed to load order registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${id}`, { status: newStatus });
      toast.success(`Order #${id.slice(-6).toUpperCase()} is now ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (loading && orders.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Acquisition <span className="text-primary italic">Ledger</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Monitor and fulfill the desires of your global clientele.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search by order signature or client name..." 
            className="w-full pl-16 pr-8 py-5 bg-card border border-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm text-xl"
            value={searchTerm}
            onChange={(e) => {
               setSearchTerm(e.target.value);
               setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
            <select 
              className="pl-12 pr-10 py-5 bg-card border border-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-[10px] uppercase tracking-widest text-muted-foreground appearance-none min-w-[220px] shadow-sm cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                 setStatusFilter(e.target.value);
                 setCurrentPage(1);
              }}
            >
              <option value="all">All Acquisitions</option>
              <option value="placed">Initiated</option>
              <option value="paid">Authenticated</option>
              <option value="shipped">In Transit</option>
              <option value="delivered">Fulfilled</option>
              <option value="cancelled">Voided</option>
            </select>
          </div>
        </div>
      </div>

      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-6">Order Signature</th>
                <th className="px-8 py-6">Client</th>
                <th className="px-8 py-6">Timeline</th>
                <th className="px-8 py-6 text-center">Value</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {orders.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground italic">No acquisitions found in this ledger.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-primary/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors italic">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-tighter">{order.items.length} Masterpieces</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {typeof order.user === 'object' ? (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary border border-primary/20 font-bold text-xs uppercase shadow-sm">
                            {(order.user?.firstname?.[0] || '?')}{(order.user?.lastname?.[0] || '?')}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground text-sm">{order.user?.firstname} {order.user?.lastname}</span>
                            <span className="text-[10px] text-muted-foreground truncate max-w-[150px] font-mono leading-none mt-0.5">{order.user?.email}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-muted-foreground italic text-sm">
                          <UserIcon size={16} />
                          Anonymous Connoisseur
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-lg w-fit">
                        <Calendar size={14} className="text-primary" />
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-xl text-foreground">${order.total.toFixed(2)}</span>
                        <div className="flex items-center gap-1 text-[8px] font-bold uppercase text-primary tracking-widest mt-1">
                          <CreditCard size={8} /> Secure
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all shadow-sm ${
                          order.status === 'delivered' ? 'bg-primary/10 text-primary border-primary/20' :
                          order.status === 'cancelled' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          order.status === 'shipped' ? 'bg-secondary text-foreground border-border' :
                          'bg-muted/40 text-muted-foreground border-border/50'
                        }`}>
                          {order.status === 'placed' ? 'Initiated' :
                          order.status === 'paid' ? 'Authenticated' :
                          order.status === 'shipped' ? 'In Transit' :
                          order.status === 'delivered' ? 'Fulfilled' :
                          order.status === 'cancelled' ? 'Voided' : order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="relative group/select">
                          <select 
                            title="Update Status"
                            className="pl-3 pr-8 py-3 border border-border bg-card rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary appearance-none cursor-pointer hover:border-primary transition-all shadow-sm"
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          >
                            <option value="placed">Initiated</option>
                            <option value="paid">Authenticated</option>
                            <option value="shipped">In Transit</option>
                            <option value="delivered">Fulfilled</option>
                            <option value="cancelled">Voided</option>
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-primary pointer-events-none" size={12} />
                        </div>
                        <button 
                          className="p-3 border border-border bg-card rounded-2xl hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 shadow-sm"
                          title="View Manuscript"
                        >
                          <Eye size={18} />
                        </button>
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

export default AdminOrders;
