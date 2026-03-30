import React, { useEffect, useState } from "react";
import { 
  Users, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  TrendingUp,
  Clock
} from "lucide-react";
import api from "../../redux/api";

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

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-6 rounded-3xl hover:border-primary/50 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}/10 text-${color} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
          <TrendingUp size={12} />
          {trend}%
        </div>
      )}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
    </div>
  </div>
);

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
          Dashboard <span className="text-primary text-xl align-top font-sans">Analytical</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Welcome back, Admin. Here's a summary of your performance.
        </p>
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
        />
        <StatCard 
          title="Active Users" 
          value={stats?.users} 
          icon={Users} 
          color="indigo" 
          trend={4.1}
        />
        <StatCard 
          title="Total Products" 
          value={stats?.products} 
          icon={Package} 
          color="amber" 
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
                onClick={() => window.location.href = '/admin/orders'}
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-accent/10 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{order.user?.firstname} {order.user?.lastname}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">{order.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                            order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' :
                            'bg-amber-500/10 text-amber-500'
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

        <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl p-6 h-fit sticky top-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="text-primary" size={20} />
              Quick Actions
            </h2>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.href = '/admin/products'}
              className="w-full p-4 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Manage Inventory
            </button>
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="w-full p-4 border border-border bg-background rounded-2xl font-semibold hover:bg-accent transition-all"
            >
              Manage User Access
            </button>
            <div className="pt-6 mt-6 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Inventory Alerts</h3>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <p className="text-xs text-amber-600 font-medium">Some products are low in stock</p>
                <button 
                  onClick={() => window.location.href = '/admin/products'}
                  className="mt-2 text-[10px] font-bold text-amber-700 uppercase tracking-wider hover:underline"
                >
                  Restock Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
