/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/redux/slices/productSlice";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import Pagination from "@/components/ui/Pagination";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import FilterSidebar from "@/components/filters/FilterSidebar";

const ITEMS_PER_PAGE = 9;

const CATEGORY_META: Record<
  string,
  { title: string; subtitle: string; description: string; heroBg: string }
> = {
  skincare: {
    title: "Skincare",
    subtitle: "Your Daily Ritual",
    description:
      "Science-backed formulas crafted to cleanse, treat, hydrate and protect. Build a routine that works for your unique skin.",
    heroBg:
      "from-primary/10 via-background to-background",
  },
  makeup: {
    title: "Makeup",
    subtitle: "Express Yourself",
    description:
      "Pigment-rich, long-wearing makeup crafted to enhance your natural beauty — from barely-there to full glam.",
    heroBg:
      "from-secondary/20 via-background to-background",
  },
  haircare: {
    title: "Haircare",
    subtitle: "Healthy From Root to Tip",
    description:
      "Nourishing, science-backed formulas designed for every hair type and texture.",
    heroBg:
      "from-muted via-background to-background",
  },
  bodycare: {
    title: "Bodycare",
    subtitle: "Head-to-Toe Glow",
    description:
      "Indulgent body care rituals that cleanse, exfoliate, and deeply hydrate your skin.",
    heroBg:
      "from-primary/10 via-secondary/10 to-background",
  },
  fragrance: {
    title: "Fragrance",
    subtitle: "Find Your Signature",
    description:
      "Captivating scents for every mood, occasion, and season. Discover your next obsession.",
    heroBg:
      "from-muted via-secondary/10 to-background",
  },
};

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector(
    (state) => state.products || { items: [], status: "idle" },
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("default");

  const meta = CATEGORY_META[slug ?? ""] ?? {
    title: slug ?? "Collection",
    subtitle: "Browse our collection",
    description: "",
    heroBg: "from-background to-background",
  };

  useEffect(() => {
    setCurrentPage(1);
    dispatch(fetchProducts({ category: slug, limit: 100 }));
  }, [slug, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), sort]);

  // Filter & sort
  let products = [...items];

  // Apply additional search param filters (skinTypes, concerns, price range)
  const skinTypes = searchParams.get("skinTypes");
  const concerns = searchParams.get("concerns");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  if (skinTypes) {
    const types = skinTypes.split(",").map((t) => t.trim().toLowerCase());
    products = products.filter((p) =>
      p.skinTypes?.some((st) => types.includes(st.toLowerCase())),
    );
  }
  if (concerns) {
    const list = concerns.split(",").map((c) => c.trim().toLowerCase());
    products = products.filter((p) =>
      p.concerns?.some((c) => list.includes(c.toLowerCase())),
    );
  }
  if (minPrice) products = products.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => p.price <= Number(maxPrice));

  // Apply sort
  if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  else if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
  else if (sort === "newest")
    products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  // Pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const isLoading = status === "loading";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero Banner ── */}
      <div
        className={`bg-gradient-to-b ${meta.heroBg} pt-14 pb-12 md:pt-20 md:pb-16`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] text-muted-foreground mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">{meta.title}</span>
          </nav>

          <div className="max-w-xl">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-primary/70 mb-3">
              {meta.subtitle}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4 leading-tight">
              {meta.title}
            </h1>
            {meta.description && (
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                {meta.description}
              </p>
            )}
          </div>

          {/* Quick stats */}
          {!isLoading && (
            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {products.length}
              </span>
              <span>{products.length === 1 ? "product" : "products"}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Toolbar: Sort + Mobile filter */}
        <div className="flex items-center justify-between gap-4 mb-8 border-b border-border/50 pb-6">
          {/* Mobile filter trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[300px] sm:w-[380px] overflow-y-auto pl-4"
              >
                <SheetHeader className="border-b pb-4 mb-6">
                  <SheetTitle className="text-left font-serif text-2xl uppercase tracking-tighter">
                    Filters
                  </SheetTitle>
                </SheetHeader>
                <FilterSidebar />
              </SheetContent>
            </Sheet>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <label
              htmlFor="sort"
              className="text-xs text-muted-foreground uppercase tracking-wider hidden sm:block"
            >
              Sort:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-28">
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground mb-5">
                Filter By
              </h3>
              <FilterSidebar />
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                  {currentProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-2xl bg-accent/20">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-5 shadow-sm">
                  <X className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="font-serif text-2xl mb-2">No products found</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Try adjusting your filters or{" "}
                  <Link
                    to={`/category/${slug}`}
                    className="text-primary underline underline-offset-2"
                  >
                    clear all filters
                  </Link>{" "}
                  to see more.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
