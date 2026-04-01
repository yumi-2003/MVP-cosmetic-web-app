import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createOrder } from "@/redux/slices/orderSlice";
import { clearCart } from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Truck, MapPin, CreditCard, Loader2 } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart || { items: [] });
  const { status: orderStatus } = useAppSelector((state) => state.orders || { status: "idle" });
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.isAdmin ?? false;

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [distanceKm, setDistanceKm] = useState(15); // Default dummy distance

  // Replicating Backend Calculation
  const { subtotal, tax, shipping, total } = useMemo(() => {
    const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const baseTax = rawSubtotal * 0.05;
    const distanceTax = distanceKm * 0.10;
    const computedTax = Number((baseTax + distanceTax).toFixed(2));
    
    // Shipping cost: $5 base + $0.50 per km
    const computedShipping = distanceKm > 0 ? Number((5 + distanceKm * 0.50).toFixed(2)) : 0;
    
    return {
      subtotal: rawSubtotal,
      tax: computedTax,
      shipping: computedShipping,
      total: Number((rawSubtotal + computedTax + computedShipping).toFixed(2))
    };
  }, [items, distanceKm]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/shop");
      return;
    }

    try {
      // Map Redux cart items to the shape the backend expects
      const orderItems = items.map((item) => ({
        productId: item.product,
        quantity: item.quantity,
      }));

      const order = await dispatch(
        createOrder({
          items: orderItems,
          shippingAddress,
          distanceKm,
        })
      ).unwrap();

      dispatch(clearCart());
      toast.success("Order placed! Track your delivery below.");
      navigate(`/tracking/${order._id}`);
    } catch (err: any) {
      toast.error(err || "Failed to place order.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ─── Admin guard ─────────────────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-5xl">
          🚫
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-light">Admin accounts cannot place orders</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Checkout is restricted to regular customer accounts only.
          </p>
        </div>
        <Button onClick={() => navigate("/admin")}>
          Go to Admin Dashboard
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <h1 className="text-3xl md:text-4xl font-serif font-light mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Shipping Info Card */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-xl font-medium tracking-wide">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input required id="street" name="street" value={shippingAddress.street} onChange={handleChange} placeholder="123 Blossom Lane" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input required id="city" name="city" value={shippingAddress.city} onChange={handleChange} placeholder="Los Angeles" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input required id="state" name="state" value={shippingAddress.state} onChange={handleChange} placeholder="CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input required id="zipCode" name="zipCode" value={shippingAddress.zipCode} onChange={handleChange} placeholder="90001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input required id="country" name="country" value={shippingAddress.country} onChange={handleChange} placeholder="United States" />
                </div>
              </div>
            </div>

            {/* Distance Simulation Card */}
            <div className="bg-secondary/30 border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Truck className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-medium tracking-wide">Distance Tax & Shipping Engine</h2>
                  <p className="text-xs text-muted-foreground mt-1">Sample feature: Adjust distance to recalculate live taxes</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>Estimated Delivery Distance</span>
                  <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground px-1 mt-1">
                  <span>Local (0km)</span>
                  <span>National (500km)</span>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-lg tracking-wide rounded-xl shadow-md lg:hidden"
              disabled={orderStatus === "loading"}
            >
              {orderStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
              Place Order - ${total.toFixed(2)}
            </Button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-xl font-medium tracking-wide mb-6">Order Summary</h2>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6">
              {items.map((item) => (
                <div key={item.product} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-secondary shrink-0 overflow-hidden border border-border/50">
                    <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <strong className="text-sm shrink-0">${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="border-t border-border/40 pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1">Shipping <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">({distanceKm}km)</span></span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-border/40 pt-4 mt-4 flex justify-between items-end">
                <span className="font-medium">Total</span>
                <span className="text-2xl font-serif text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form"
              className="w-full mt-8 py-6 text-base tracking-wide rounded-xl shadow-md hidden lg:flex"
              disabled={orderStatus === "loading"}
            >
              {orderStatus === "loading" ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CreditCard className="w-5 h-5 mr-2" />}
              Complete Order
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
