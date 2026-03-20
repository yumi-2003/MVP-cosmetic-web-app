import type { Product } from "@/type";
import { Button } from "@/components/ui/button";
import { FavIcon, StarIcon, CartIcon } from "@/components/icons";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const hasDiscount = product.previousPrice && product.previousPrice > product.price;
  const discountAmount = hasDiscount ? product.previousPrice! - product.price : 0;

  return (
    <div className="group flex flex-col gap-4">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted transition-all">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Add to Cart - Slide up on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10 px-4 pb-4">
          <Button 
            className="w-full bg-background/95 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground border border-border/50 rounded-md py-6 shadow-2xl active:scale-[0.98] transition-all duration-300"
          >
            <CartIcon className="w-4 h-4 mr-2" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Add to Cart</span>
          </Button>
        </div>

        {/* badges - Top Left */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.tags.includes("NEW") && (
              <span className="bg-primary text-primary-foreground px-3 py-1 text-[9px] font-bold tracking-wider uppercase">
                NEW
              </span>
            )}
            {product.tags.includes("BEST SELLER") && (
              <span className="bg-secondary text-secondary-foreground px-3 py-1 text-[9px] font-bold tracking-wider uppercase shadow-sm">
                BEST SELLER
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          aria-label="Add to favorites"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <FavIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
            {product.category}
          </span>
          <h3 className="font-serif text-base text-foreground mt-1 group-hover:text-primary transition-colors">
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
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.previousPrice?.toFixed(2)}
              </span>
            )}
          </div>
          {hasDiscount && (
            <p className="text-[10px] font-bold text-red-600 uppercase mt-1">
              Save ${discountAmount.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
