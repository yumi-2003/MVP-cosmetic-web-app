import React, { useState } from "react";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/filters/FilterSidebar";
import Pagination from "@/components/ui/Pagination";
import { FavIcon, MenuIcon } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ITEMS_PER_PAGE = 6;

const Shop = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Simple pagination logic
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase">Premium Collection</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-3 md:mb-4">
                Discover Your Skincare
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm max-w-md">
                Curated products for your unique skin journey. Find the perfect routine tailored to your needs.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 border border-border hover:bg-accent transition-colors">
                <FavIcon className="w-4 h-4" />
                <span className="text-xs md:text-sm font-medium">Favorites</span>
              </button>

              {/* Mobile Filter Button */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2 border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <MenuIcon className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wider">Filters</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto pl-4">
                    <SheetHeader className="border-b pb-4 mb-6">
                      <SheetTitle className="text-left font-serif text-2xl uppercase tracking-tighter">Filters</SheetTitle>
                    </SheetHeader>
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
