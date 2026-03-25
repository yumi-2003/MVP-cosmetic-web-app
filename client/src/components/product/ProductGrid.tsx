import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { IProduct } from "@/redux/types";

interface ProductGridProps {
  title: string;
  products: IProduct[];
}

const ProductGrid = ({ title, products }: ProductGridProps) => {
  return (
    <section className="mx-auto max-w-8xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-serif text-3xl text-foreground">{title}</h2>
        <Link
          to="/shop"
          className="group flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:text-primary"
        >
          <span className="relative pb-1">
            Shop All
            <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
