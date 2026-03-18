import type { Product } from "@/type";
import { Button } from "@/components/ui/button";
import { FavIcon } from "@/components/icons";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group flex flex-col gap-4">
      {/* Image Container with Tags */}
      <div className="relative aspect-square overflow-hidden bg-muted group-hover:opacity-90 transition-opacity">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
        <button
          type="button"
          aria-label="Add to favorites"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground/80 shadow-sm transition-colors hover:bg-background"
        >
          <FavIcon className="h-4 w-4" />
        </button>
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-background px-2 py-1 text-[10px] font-medium tracking-wider text-foreground uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-foreground">
            {product.name}
          </h3>
          <span className="text-sm font-medium text-foreground">
            ${product.price}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
      </div>

      {/* Add to Bag Button */}
      <Button
        variant="outline"
        className="w-full rounded-none uppercase tracking-widest text-xs h-12 font-medium"
      >
        Add to Bag
      </Button>
    </div>
  );
};

export default ProductCard;
