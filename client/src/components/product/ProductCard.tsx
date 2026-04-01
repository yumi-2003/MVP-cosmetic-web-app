import { useState } from "react";
import { useNavigate, Link } from "react-router";
import type { IProduct } from "@/redux/types";
import { Button } from "@/components/ui/button";
import { FavIcon, StarIcon, CartIcon } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleFavorite } from "@/redux/slices/favoriteSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountAmount = hasDiscount ? product.comparePrice! - product.price : 0;

  const { user } = useAppSelector((state) => state.auth);
  const { itemIds, status } = useAppSelector((state) => state.favorites);
  
  const isFavorited = itemIds.includes(product._id);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const isAdmin = user?.isAdmin ?? false;

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    try {
      setIsAdding(true);
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart!`, {
        action: {
          label: "View Cart",
          onClick: () => navigate("/cart"),
        },
        duration: 4000,
      });
    } catch (error: any) {
      toast.error(error || "Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to manage your favorites", {
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    try {
      setIsFavoriting(true);
      const res = await dispatch(toggleFavorite(product)).unwrap();
      if (res.message === "Product added to favorites") {
        toast.success(`${product.name} added to favorites!`);
      } else {
        toast.info(`${product.name} removed from favorites`);
      }
    } catch (error: any) {
      toast.error(error || "Failed to update favorites");
    } finally {
      setIsFavoriting(false);
    }
  };

  const categoryName = typeof product.category === "string" ? product.category : product.category.name;

  return (
    <div className="group flex flex-col gap-4">
      {/* Image Container */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-muted transition-all rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        
        {/* Add to Cart - Slide up on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 px-4 pb-4 flex flex-col gap-2">
          {isAdmin ? (
            <div className="w-full bg-background/95 backdrop-blur-md text-muted-foreground border border-border/50 rounded-lg py-3 px-4 text-center shadow-xl text-[10px] font-bold tracking-[0.15em] uppercase">
              Admin — Cannot Purchase
            </div>
          ) : (
            <Button 
              onClick={handleAddToCart}
              disabled={isAdding || (product.countInStock ?? 0) === 0}
              className="w-full bg-background/95 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground border border-border/50 rounded-lg py-6 shadow-xl active:scale-[0.98] transition-all duration-300 group/btn disabled:opacity-80 disabled:bg-muted disabled:text-muted-foreground"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary group-hover/btn:text-primary-foreground" />
              ) : (product.countInStock ?? 0) === 0 ? (
                null
              ) : (
                <CartIcon className="w-4 h-4 mr-2 text-primary group-hover/btn:text-primary-foreground transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-[-10deg]" />
              )}
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                {isAdding ? "Adding..." : (product.countInStock ?? 0) === 0 ? "Out of Stock" : "Add to Cart"}
              </span>
            </Button>
          )}
        </div>

        {/* badges - Top Left */}
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {(product.countInStock ?? 0) === 0 && (
            <span className="bg-destructive text-destructive-foreground px-3 py-1 text-[9px] font-bold tracking-wider uppercase rounded-sm shadow-sm">
              OUT OF STOCK
            </span>
          )}
          {product.tags && product.tags.length > 0 && (
            <>
              {product.tags.includes("NEW") && (
                <span className="bg-primary text-primary-foreground px-3 py-1 text-[9px] font-bold tracking-wider uppercase rounded-sm shadow-sm">
                  NEW
                </span>
              )}
              {product.tags.includes("BEST SELLER") && (
                <span className="bg-secondary text-secondary-foreground px-3 py-1 text-[9px] font-bold tracking-wider uppercase shadow-md rounded-sm">
                  BEST SELLER
                </span>
              )}
            </>
          )}
        </div>

        {!isAdmin && (
          <button
            onClick={handleToggleFavorite}
            disabled={isFavoriting || status === "loading"}
            type="button"
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-all hover:scale-110 disabled:opacity-50 ${
              isFavorited
                ? "text-primary hover:bg-background/90"
                : "text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            <FavIcon className={`h-4 w-4 transition-colors ${isFavorited ? "fill-primary text-primary" : ""}`} />
          </button>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground dark:text-primary/80">
            {categoryName}
          </span>
          <Link to={`/product/${product.slug}`}>
            <h3 className="mt-1 line-clamp-1 font-serif text-base text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mt-0.5">
          {(product.countInStock ?? 0) > 0 ? (
            <span className={`text-[10px] font-medium ${(product.countInStock ?? 0) < 10 ? 'text-secondary font-bold' : 'text-primary'}`}>
              {(product.countInStock ?? 0) < 10 ? `Only ${product.countInStock} left` : `${product.countInStock} in stock`}
            </span>
          ) : (
            <span className="text-[10px] font-medium text-destructive">
              Currently Unavailable
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through opacity-85">
                ${product.comparePrice?.toFixed(2)}
              </span>
            )}
          </div>
          {hasDiscount && (
            <p className="text-[10px] font-bold text-primary uppercase mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Save ${discountAmount.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
