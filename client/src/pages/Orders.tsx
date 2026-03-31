import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchOrders } from "@/redux/slices/orderSlice";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Order Received",
    className: "bg-muted text-muted-foreground border-border",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  processing: {
    label: "Processing",
    className: "bg-secondary/30 text-secondary-foreground border-secondary/50",
    icon: <Package className="w-3.5 h-3.5" />,
  },
  shipped: {
    label: "Shipped",
    className: "bg-secondary/50 text-secondary-foreground border-secondary",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-primary/10 text-primary border-primary/30",
    icon: <Truck className="w-3.5 h-3.5" />,
  },
  delivered: {
    label: "Delivered",
    className: "bg-primary/20 text-primary border-primary/40 font-bold",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  failed: {
    label: "Delivery Failed",
    className: "bg-destructive/10 text-destructive border-destructive/30",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  returned: {
    label: "Returned",
    className: "bg-muted text-muted-foreground border-border",
    icon: <RotateCcw className="w-3.5 h-3.5" />,
  },
} as const;

type DeliveryStatus = keyof typeof STATUS_CONFIG;

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { orders, status, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchOrders(user._id));
    }
  }, [dispatch, user?._id]);

  if (status === "loading") {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle className="w-10 h-10 text-destructive opacity-70" />
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {error || "Failed to load your orders."}
        </p>
        <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-light">No orders yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            When you place an order, it will appear here with delivery status.
          </p>
        </div>
        <Button onClick={() => navigate("/shop")}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-light">Order History</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Track delivery status for your recent purchases.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/shop")}>
          Continue Shopping
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const deliveryStatus = (order.delivery?.status || "pending") as DeliveryStatus;
          const statusConfig = STATUS_CONFIG[deliveryStatus];
          const totalItems = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const orderDate = order.placedAt || order.createdAt;
          const orderTotal = Number(order.total ?? order.subtotal ?? 0);

          return (
            <div
              key={order._id}
              className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Order ID: <span className="font-mono">{order._id}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide border rounded-full px-2.5 py-1 ${statusConfig.className}`}
                    >
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(orderDate)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-semibold">${orderTotal.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/tracking/${order._id}`)}
                  >
                    Track Order
                  </Button>
                </div>
              </div>

              <div className="mt-4 border-t border-border/40 pt-4 grid gap-3 sm:grid-cols-2">
                {order.items.map((item) => {
                  const productId =
                    typeof item.product === "string" ? item.product : item.product._id;
                  return (
                  <div key={`${order._id}-${productId}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-secondary border border-border/40 overflow-hidden shrink-0">
                      <img
                        src={item.image || "https://via.placeholder.com/96"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
