import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchFavorites } from "@/redux/slices/favoriteSlice";
import ProductCard from "@/components/product/ProductCard";
import { Link, Navigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function Favorites() {
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state) => state.favorites);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user && status === "idle") {
      dispatch(fetchFavorites());
    }
  }, [user, status, dispatch]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-destructive font-medium">{error}</p>
        <button
          onClick={() => dispatch(fetchFavorites())}
          className="text-sm border-b border-foreground/60 pb-0.5 text-foreground uppercase tracking-wider hover:text-primary hover:border-primary transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 bg-background">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-[2px] after:bg-primary">
            WISHLIST
          </h1>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.3em] font-medium mt-6">
            {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-12 md:py-24 max-w-md mx-auto text-center">
            <div className="rounded-full bg-secondary/30 p-8 border border-border/50">
              <span className="text-5xl text-muted-foreground/50 block leading-none">♡</span>
            </div>
            <h3 className="text-2xl font-serif text-foreground">Your Wishlist is Empty</h3>
            <p className="text-muted-foreground/80 leading-relaxed mb-4">
              Explore our collection and add some products you love to your wishlist to easily find them later.
            </p>
            <Link
              to="/shop"
              className="bg-foreground py-3.5 px-8 text-xs font-bold uppercase tracking-[0.2em] text-background transition-transform hover:scale-105 active:scale-95 shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
