import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/redux/slices/productSlice";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import FilterSidebar from "@/components/filters/FilterSidebar";
import Pagination from "@/components/ui/Pagination";
import { FavIcon, MenuIcon } from "@/components/icons";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { IProduct } from "@/redux/types";

const ITEMS_PER_PAGE = 6;

const Shop = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { items, status } = useAppSelector((state) => state.products || { items: [], status: "idle" });
  const favoriteItems = useAppSelector((state) => state.favorites?.items || []);
  const favoritesCount = favoriteItems.length;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const category = searchParams.get("category") || undefined;
    const skinTypes = searchParams.get("skinTypes") || undefined;
    const concerns = searchParams.get("concerns") || undefined;
    const minPrice = searchParams.get("minPrice") || undefined;
    const maxPrice = searchParams.get("maxPrice") || undefined;
    const inStock = searchParams.get("inStock") || undefined;
    
    setCurrentPage(1); // Reset page on filter change
    
    // Pass limit: 100 to fetch more products for the frontend pagination
    dispatch(fetchProducts({ category, skinTypes, concerns, minPrice, maxPrice, inStock, limit: 100 }));
  }, [dispatch,
    searchParams.get("category"),
    searchParams.get("skinTypes"),
    searchParams.get("concerns"),
    searchParams.get("minPrice"),
    searchParams.get("maxPrice"),
    searchParams.get("inStock"),
  ]);
  
  // Simple frontend pagination logic until backend pagination is passed up
  const products: IProduct[] = items || [];
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);
  const filteredProducts = query
    ? products.filter((product: IProduct) => {
        const name = product.name?.toLowerCase() || "";
        const category =
          typeof product.category === "string"
            ? product.category.toLowerCase()
            : product.category?.name?.toLowerCase() || "";
        const skinTypes = (product.skinTypes || [])
          .map((t) => t.toLowerCase())
          .join(" ");
        const concerns = (product.concerns || [])
          .map((c) => c.toLowerCase())
          .join(" ");

        return (
          name.includes(query) ||
          category.includes(query) ||
          skinTypes.includes(query) ||
          concerns.includes(query)
        );
      })
    : products;

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
              <Link to="/favorites" className="flex items-center relative">
                <FavIcon className="w-5 h-5" />
                {favoritesCount > 0 ? (
                  <span className="absolute -top-1/2 -right-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background">
                    {favoritesCount}
                  </span>
                ) : (
                  <span className="absolute -top-1/2 -right-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-background">
                    0
                  </span>
                )}
              </Link>

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
            {status === "loading" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-lg bg-accent/30">
                <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl mb-2">No Matching Products</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  We couldn't find anything matching your filters. Try selecting different criteria or clear your filters to start over.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
