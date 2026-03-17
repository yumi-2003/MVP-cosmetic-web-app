import type { Product } from "@/type";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group flex flex-col gap-4">
      {/* Image Container with Tags */}
      <div className="relative aspect-square overflow-hidden bg-[#f9f9f9] group-hover:opacity-90 transition-opacity">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute right-0 top-0">fav</div>
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white px-2 py-1 text-[10px] font-medium tracking-wider text-gray-800 uppercase"
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
          <h3 className="font-serif text-lg text-gray-800">{product.name}</h3>
          <span className="text-sm font-medium text-gray-900">
            ${product.price}
          </span>
        </div>
        <p className="text-sm text-gray-500">{product.brand}</p>
      </div>

      {/* Add to Bag Button */}
      <Button
        variant="outline"
        className="w-full rounded-none border-gray-300 uppercase tracking-widest text-xs h-12 hover:bg-gray-50 font-medium text-gray-700"
      >
        Add to Bag
      </Button>
    </div>
  );
};

export default ProductCard;
