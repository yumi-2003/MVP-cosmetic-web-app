import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTracking } from "@/redux/slices/trackingSlice";
import { DeliveryBikeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  Home,
} from "lucide-react";

// ─── Status config ───────────────────────────────────────────────────────────
type DeliveryStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned";

const STATUS_CONFIG: Record<
  DeliveryStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Order Received",
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
    icon: <Clock className="w-4 h-4" />,
  },
  processing: {
    label: "Processing",
    color: "text-secondary-foreground",
    bg: "bg-secondary/30 border-secondary/50",
    icon: <Package className="w-4 h-4" />,
  },
  shipped: {
    label: "Shipped",
    color: "text-secondary-foreground",
    bg: "bg-secondary/50 border-secondary",
    icon: <Truck className="w-4 h-4" />,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    icon: <DeliveryBikeIcon className="w-4 h-4" />,
  },
  delivered: {
    label: "Delivered",
    color: "text-primary",
    bg: "bg-primary/20 border-primary/40",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  failed: {
    label: "Delivery Failed",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  returned: {
    label: "Returned",
    color: "text-muted-foreground",
    bg: "bg-muted border-border",
    icon: <RotateCcw className="w-4 h-4" />,
  },
};

// progress order for the timeline stepper
const PROGRESS_STEPS: DeliveryStatus[] = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const TrackingPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tracking, status, error } = useAppSelector((s) => s.tracking);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchTracking(orderId));
    }
  }, [orderId, dispatch]);

  // ─── Loading skeleton ───────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────────────────────
  if (status === "failed" || error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle className="w-12 h-12 text-destructive opacity-60" />
        <p className="text-muted-foreground text-sm text-center max-w-sm">
          {error || "Could not load tracking info for this order."}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
          <Button onClick={() => navigate("/")}>
            <Home className="w-4 h-4 mr-2" /> Home
          </Button>
        </div>
      </div>
    );
  }

  if (!tracking) return null;

  const config = STATUS_CONFIG[tracking.status] ?? STATUS_CONFIG.pending;
  const currentStepIndex = PROGRESS_STEPS.indexOf(
    tracking.status as DeliveryStatus
  );
  const isFinalState =
    tracking.status === "failed" || tracking.status === "returned";

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Back nav */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to home
      </button>

      {/* ─── Hero Status Card ──────────────────────────────────────────────── */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm ${config.bg}`}
      >
        {/* Animated bicycle icon */}
        <div
          className={`shrink-0 w-20 h-20 rounded-full bg-background flex items-center justify-center shadow-md border border-border/30 ${
            tracking.status === "out_for_delivery" ? "animate-bounce" : ""
          }`}
        >
          <DeliveryBikeIcon className={`w-10 h-10 ${config.color}`} />
        </div>

        <div className="text-center sm:text-left">
          <div
            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-3 ${config.bg} ${config.color}`}
          >
            {config.icon}
            {config.label}
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-light">
            Tracking Your Order
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Order ID:{" "}
            <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
              {tracking.order}
            </span>
          </p>
          {tracking.trackingNumber && (
            <p className="text-sm text-muted-foreground mt-1">
              Tracking #{" "}
              <span className="font-semibold text-foreground">
                {tracking.trackingNumber}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ─── Progress Stepper ─────────────────────────────────────────────── */}
      {!isFinalState && (
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            Delivery Progress
          </h2>
          <div className="relative flex items-start justify-between">
            {/* connector bar */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/60 mx-8 z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-700 mx-8 z-0"
              style={{
                width:
                  currentStepIndex < 0
                    ? "0%"
                    : `${(currentStepIndex / (PROGRESS_STEPS.length - 1)) * 100}%`,
              }}
            />

            {PROGRESS_STEPS.map((step, i) => {
              const sc = STATUS_CONFIG[step];
              const passed = i <= currentStepIndex;
              const active = i === currentStepIndex;
              return (
                <div
                  key={step}
                  className="flex flex-col items-center gap-2 z-10 flex-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      active
                        ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30"
                        : passed
                        ? "bg-primary/80 border-primary/80 text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                    }`}
                  >
                    {sc.icon}
                  </div>
                  <span
                    className={`text-[10px] font-medium text-center leading-tight max-w-[60px] ${
                      passed ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* ─── Delivery Details ────────────────────────────────────────────── */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Delivery Details
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Shipping Address</p>
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                  {tracking.address.street}, {tracking.address.city},{" "}
                  {tracking.address.state} {tracking.address.zipCode},{" "}
                  {tracking.address.country}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Truck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Carrier</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {tracking.carrier || "Standard Shipping"} •{" "}
                  {tracking.distanceKm} km
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {formatDate(tracking.estimatedDelivery)}
                </p>
              </div>
            </div>
            {tracking.actualDelivery && (
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Delivered On</p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {formatDate(tracking.actualDelivery)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Status History / Timeline ───────────────────────────────────── */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Status History
          </h2>
          <div className="relative space-y-4 pl-4">
            {/* vertical line */}
            <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-border/50" />

            {[...tracking.statusHistory].reverse().map((event, i) => {
              const evConfig =
                STATUS_CONFIG[event.status as DeliveryStatus] ??
                STATUS_CONFIG.pending;
              return (
                <div key={i} className="relative flex gap-3">
                  <div
                    className={`shrink-0 w-3.5 h-3.5 rounded-full border-2 mt-0.5 z-10 ${
                      i === 0
                        ? "bg-primary border-primary"
                        : "bg-background border-border"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        i === 0 ? evConfig.color : "text-foreground"
                      }`}
                    >
                      {evConfig.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {event.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {formatDate(event.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center pt-2">
        <Button variant="outline" onClick={() => navigate("/shop")} className="px-8">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default TrackingPage;
