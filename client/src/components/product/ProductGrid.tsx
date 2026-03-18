import { Link } from "react-router";
import ProductCard from "./ProductCard";
import type { Product } from "@/type";

interface ProductGridProps {
  title: string;
  products: Product[];
}

const ProductGrid = ({ title, products }: ProductGridProps) => {
  return (
    <section className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-3xl text-foreground">{title}</h2>
        <Link
          to="/shop"
          className="text-sm border-b border-foreground/60 pb-0.5 text-foreground uppercase tracking-wider hover:text-muted-foreground hover:border-muted-foreground transition-colors"
        >
          Shop All
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
