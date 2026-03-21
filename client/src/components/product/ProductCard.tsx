import { useState } from "react";
import type { IProduct } from "@/redux/types";
import { Button } from "@/components/ui/button";
import { FavIcon, StarIcon, CartIcon } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountAmount = hasDiscount ? product.comparePrice! - product.price : 0;

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error || "Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const categoryName = typeof product.category === "string" ? product.category : product.category.name;

  return (
    <div className="group flex flex-col gap-4">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted transition-all rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        
        {/* Add to Cart - Slide up on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 px-4 pb-4">
          <Button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-background/95 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground border border-border/50 rounded-lg py-6 shadow-xl active:scale-[0.98] transition-all duration-300 group/btn"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary group-hover/btn:text-primary-foreground" />
            ) : (
              <CartIcon className="w-4 h-4 mr-2 text-primary group-hover/btn:text-primary-foreground transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-[-10deg]" />
            )}
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              {isAdding ? "Adding..." : "Add to Cart"}
            </span>
          </Button>
        </div>

        {/* badges - Top Left */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.tags.includes("NEW") && (
              <span className="bg-primary text-primary-foreground px-3 py-1 text-[9px] font-bold tracking-wider uppercase rounded-sm shadow-sm">
                NEW
              </span>
            )}
            {product.tags.includes("BEST SELLER") && (
              <span className="bg-amber-500 text-white px-3 py-1 text-[9px] font-bold tracking-wider uppercase shadow-md rounded-sm">
                BEST SELLER
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          aria-label="Add to favorites"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-sm transition-all hover:bg-rose-500 hover:text-white hover:scale-110"
        >
          <FavIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.15em] text-primary/70 uppercase">
            {categoryName}
          </span>
          <h3 className="font-serif text-base text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through opacity-70">
                ${product.comparePrice?.toFixed(2)}
              </span>
            )}
          </div>
          {hasDiscount && (
            <p className="text-[10px] font-bold text-rose-600 uppercase mt-1 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              Save ${discountAmount.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
