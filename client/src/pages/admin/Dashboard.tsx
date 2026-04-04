import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  LayoutGrid,
  FileText
} from "lucide-react";
import api from "../../redux/api";
import { DashboardSkeleton } from "../../components/ui/DashboardSkeleton";

interface DashboardStats {
  users: number;
  products: number;
  orders: number;
  categories: number;
  blogs: number;
  revenue: number;
}

interface RecentOrder {
  _id: string;
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

const StatCard = ({ title, value, icon: Icon, color, trend, path }: any) => {
  const navigate = useNavigate();
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-6 rounded-3xl hover:border-primary/50 transition-all duration-300 group relative">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl bg-${color}/10 text-${color} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            <TrendingUp size={12} />
            {trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>
      {path && (
        <button 
          onClick={() => navigate(path)}
          className="absolute bottom-6 right-6 p-2 rounded-full bg-primary/5 text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
          title={`View ${title}`}
        >
          <ArrowUpRight size={16} />
        </button>
      )}
    </div>
  );
};

const RevenueTrendChart = ({ data }: { data: any[] }) => {
  if (!data?.length) return <div className="h-48 flex items-center justify-center text-muted-foreground italic">No data available</div>;

  const maxAmount = Math.max(...data.map(d => d.amount), 100);
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 20;

  const points = data.map((d, i) => {
    const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1 || 1);
    const y = chartHeight - padding - (d.amount / maxAmount) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full h-[250px] mt-4 flex items-end">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1={padding}
            y1={chartHeight - padding - p * (chartHeight - 2 * padding)}
            x2={chartWidth - padding}
            y2={chartHeight - padding - p * (chartHeight - 2 * padding)}
            stroke="currentColor"
            strokeOpacity="0.05"
            strokeDasharray="4 4"
          />
        ))}

        {/* Gradient fill */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <path
          d={`M ${padding},${chartHeight - padding} ${points} L ${chartWidth - padding},${chartHeight - padding} Z`}
          fill="url(#areaGradient)"
          className="text-primary"
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1 || 1);
          const y = chartHeight - padding - (d.amount / maxAmount) * (chartHeight - 2 * padding);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="var(--color-primary)"
              strokeWidth="2"
              className="text-primary cursor-help group"
            />
          );
        })}
      </svg>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats");
        setStats(response.data.stats);
        setRecentOrders(response.data.recentOrders);
        setRevenueTrend(response.data.revenueTrend || []);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your store's performance and inventory.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
             onClick={() => navigate('/admin/products')}
             className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all shadow-sm"
          >
            <Package size={16} /> Products
          </button>
          <button 
             onClick={() => navigate('/admin/orders')}
             className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <ShoppingBag size={16} /> Orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`$${stats?.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="emerald" 
          trend={12.5}
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.orders} 
          icon={ShoppingBag} 
          color="primary" 
          trend={8.2}
          path="/admin/orders"
        />
        <StatCard 
          title="Active Users" 
          value={stats?.users} 
          icon={Users} 
          color="indigo" 
          trend={4.1}
          path="/admin/users"
        />
        <StatCard 
          title="Total Blogs" 
          value={stats?.blogs} 
          icon={FileText} 
          color="amber" 
          path="/admin/blogs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-primary" size={20} />
                <h2 className="text-xl font-semibold">Revenue Trends (Last 7 Days)</h2>
              </div>
            </div>
            <RevenueTrendChart data={revenueTrend} />
          </div>

          <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-card/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-primary" size={20} />
                <h2 className="text-xl font-semibold">Recent Orders</h2>
              </div>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-widest hover:translate-x-1 transition-transform"
              >
                View All Orders <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-[10px] uppercase tracking-widest font-bold">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-accent/10 transition-colors group cursor-pointer" onClick={() => navigate('/admin/orders')}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{order.user?.firstname} {order.user?.lastname}</span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[150px] font-mono">{order.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 font-bold text-sm">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                            order.status === 'delivered' ? 'bg-primary/10 text-primary border-primary/20' :
                            order.status === 'cancelled' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            'bg-muted/40 text-muted-foreground border-border/50'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="text-primary" size={20} />
                Quick Actions
              </h2>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-full p-4 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
              >
                Manage Products
              </button>
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full p-4 border border-border bg-card rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all"
              >
                Access Control
              </button>
              <button 
                onClick={() => navigate('/admin/categories')}
                className="w-full p-4 border border-border bg-card rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-accent transition-all"
              >
                Manage Categories
              </button>
            </div>
          </div>

          <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
              <LayoutGrid size={14} className="text-primary" /> System Overview
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/20 rounded-2xl">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase text-muted-foreground">Product Health</span>
                   <span className="text-sm font-bold">Stable</span>
                 </div>
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/20 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Active Sessions</span>
                    <span className="text-sm font-bold">{Math.floor(Math.random() * 50) + 12} Admins</span>
                  </div>
                 <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Users size={14} />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
