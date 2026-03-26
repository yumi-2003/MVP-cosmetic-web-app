import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import type { IProduct } from "@/redux/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: IProduct[];
  isLoading?: boolean;
  viewAllLink?: string;
}

const ProductGrid = ({
  title,
  subtitle,
  products,
  isLoading,
  viewAllLink = "/shop",
}: ProductGridProps) => {
  const skeletonItems = [...Array(5)];

  return (
    <section className="py-14 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            {subtitle && (
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/70 mb-2">
                {subtitle}
              </p>
            )}
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">{title}</h2>
          </div>
          <Link
            to={viewAllLink}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors pb-0.5 border-b border-transparent hover:border-primary shrink-0"
          >
            <span>Shop All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative px-0 sm:px-10">
          <Carousel
            opts={{ align: "start", loop: true, dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-3 md:-ml-5">
              {isLoading
                ? skeletonItems.map((_, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-3 md:pl-5 basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <ProductCardSkeleton />
                    </CarouselItem>
                  ))
                : products.map((product) => (
                    <CarouselItem
                      key={product._id}
                      className="pl-3 md:pl-5 basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
            </CarouselContent>

            {/* Nav arrows — hidden on mobile, shown on sm+ */}
            <CarouselPrevious className="hidden sm:flex -left-3 border-border bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm" />
            <CarouselNext className="hidden sm:flex -right-3 border-border bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm" />
          </Carousel>

          {/* Mobile swipe hint — only visible on mobile */}
          <p className="sm:hidden text-center text-[10px] text-muted-foreground/60 tracking-widest uppercase mt-4">
            ← Swipe to browse →
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
