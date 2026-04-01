import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeFromCart,
  updateCartItem,
} from "@/redux/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(
    (state) => state.cart || { items: [], status: "idle" }
  );
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.isAdmin ?? false;

  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQty = async (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setLoadingItem(productId);
    try {
      await dispatch(updateCartItem({ productId, quantity: newQty })).unwrap();
    } catch {
      toast.error("Failed to update quantity.");
    } finally {
      setLoadingItem(null);
    }
  };

  const handleRemove = async (productId: string, name: string) => {
    setLoadingItem(productId);
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success(`${name} removed from cart.`);
    } catch {
      toast.error("Failed to remove item.");
    } finally {
      setLoadingItem(null);
    }
  };

  // ─── Admin guard ─────────────────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-5xl">
          🚫
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-light">Admin accounts cannot shop</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Your admin account is not permitted to place orders. Please use a regular customer account.
          </p>
        </div>
        <Button onClick={() => navigate("/admin")} className="mt-2 px-8 py-5 rounded-xl tracking-wide">
          Go to Admin Dashboard
        </Button>
      </div>
    );
  }

  // ─── Empty state ────────────────────────────────────────────────────────────
  if (status !== "loading" && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-primary opacity-60" />
          </div>
          <span className="absolute -top-1 -right-1 bg-muted border border-border text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full">
            0
          </span>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif font-light">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Looks like you haven&apos;t added anything yet. Explore our collection!
          </p>
        </div>
        <Button
          onClick={() => navigate("/shop")}
          className="mt-2 px-8 py-5 rounded-xl tracking-wide"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  // ─── Loading skeleton ───────────────────────────────────────────────────────
  if (status === "loading" && items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  // ─── Full cart ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-serif font-light mb-2">
        Your Cart
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {totalItems} {totalItems === 1 ? "item" : "items"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Item List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const isUpdating = loadingItem === item.product;
            return (
              <div
                key={item.product}
                className="group bg-card border border-border/50 rounded-2xl p-4 sm:p-5 flex gap-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/30">
                  <img
                    src={item.image || "https://via.placeholder.com/96"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-base leading-snug line-clamp-2">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => handleRemove(item.product, item.name)}
                      disabled={isUpdating}
                      aria-label="Remove item"
                      className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-1 border border-border/60 rounded-full px-1 py-0.5 bg-secondary/30">
                      <button
                        onClick={() =>
                          handleUpdateQty(item.product, item.quantity - 1)
                        }
                        disabled={isUpdating || item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium tabular-nums">
                        {isUpdating ? (
                          <Loader2 className="w-3 h-3 animate-spin inline" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQty(item.product, item.quantity + 1)
                        }
                        disabled={isUpdating}
                        aria-label="Increase quantity"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line price */}
                    <span className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm lg:sticky lg:top-28 space-y-5">
            <h2 className="text-lg font-medium tracking-wide">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-xs text-muted-foreground italic">
                  Calculated at checkout
                </span>
              </div>
              <div className="border-t border-border/40 pt-3 flex justify-between items-end">
                <span className="font-medium text-base">Estimated Total</span>
                <span className="text-2xl font-serif text-primary">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={() => navigate("/checkout")}
              className="w-full py-6 text-base tracking-wide rounded-xl shadow-md"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <button
              onClick={() => navigate("/shop")}
              className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors mt-1"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
