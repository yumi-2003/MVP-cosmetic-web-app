import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchProductBySlug,
  fetchProducts,
  clearSelectedProduct,
} from "@/redux/slices/productSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleFavorite } from "@/redux/slices/favoriteSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import ProductCard from "@/components/product/ProductCard";
import { FavIcon, StarIcon, CartIcon } from "@/components/icons";
import { Loader2, ChevronLeft, CheckCircle2 } from "lucide-react";

const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Skeleton className="h-4 w-40 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-xl" />
            ))}
          </div>
        </div>
        {/* Info */}
        <div className="space-y-5 pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl mt-6" />
        </div>
      </div>
    </div>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedProduct: product, status, items: allProducts } = useAppSelector(
    (state) => state.products
  );
  const { user } = useAppSelector((state) => state.auth);
  const { itemIds, status: favStatus } = useAppSelector((state) => state.favorites);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  const isFavorited = product ? itemIds.includes(product._id) : false;

  useEffect(() => {
    if (id) {
      dispatch(fetchProductBySlug(id));
    }
    if (allProducts.length === 0) {
      dispatch(fetchProducts({}));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  // Recommended: same category first, fall back to all products
  const sameCategory = allProducts.filter((p) => {
    if (!product) return false;
    if (p._id === product._id) return false;
    const pCat = typeof p.category === "string" ? p.category : p.category._id;
    const prodCat = typeof product.category === "string" ? product.category : product.category._id;
    return pCat === prodCat;
  });
  const recommended = (
    sameCategory.length >= 4
      ? sameCategory
      : [...sameCategory, ...allProducts.filter((p) => p._id !== product?._id && !sameCategory.find((s) => s._id === p._id))]
  ).slice(0, 10);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to your cart", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      return;
    }
    if (!product) return;
    try {
      setIsAdding(true);
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
      toast.success(`${product.name} added to cart!`, {
        action: { label: "View Cart", onClick: () => navigate("/cart") },
        duration: 4000,
      });
    } catch (err: any) {
      toast.error(err || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Please log in to manage favorites", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      return;
    }
    if (!product) return;
    try {
      setIsFavoriting(true);
      const res = await dispatch(toggleFavorite(product)).unwrap();
      if (res.message === "Product added to favorites") {
        toast.success(`${product.name} added to favorites!`);
      } else {
        toast.info(`${product.name} removed from favorites`);
      }
    } catch (err: any) {
      toast.error(err || "Failed to update favorites");
    } finally {
      setIsFavoriting(false);
    }
  };

  if (status === "loading") return <ProductDetailSkeleton />;

  if (status === "failed" || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="font-serif text-2xl">Product not found</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          We couldn't find this product. It may have been removed or the link is incorrect.
        </p>
        <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
      </div>
    );
  }

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0;
  const categoryName =
    typeof product.category === "string" ? product.category : product.category.name;
  const categorySlug =
    typeof product.category === "string" ? product.category : product.category.slug;
  const inStock = (product.countInStock ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 uppercase tracking-wider">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${categorySlug}`} className="hover:text-foreground transition-colors">
            {categoryName}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ── Left: Image Gallery ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm group">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow">
                  -{discountPct}%
                </span>
              )}
              {product.isBestSeller && (
                <span className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow">
                  Best Seller
                </span>
              )}
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImage === i
                        ? "border-primary shadow-md scale-105"
                        : "border-border opacity-70 hover:opacity-100 hover:border-primary/50"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="flex flex-col gap-5 pt-2">
            {/* Category & Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70">
                {categoryName}
              </span>
              {product.isNew && (
                <span className="bg-primary/10 text-primary text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-primary/20">
                  New
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-serif text-3xl md:text-4xl leading-tight text-foreground">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through opacity-60">
                    ${product.comparePrice?.toFixed(2)}
                  </span>
                  <span className="text-rose-600 text-sm font-bold">
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className={`text-sm font-medium ${(product.countInStock ?? 0) < 10 ? "text-amber-600" : "text-emerald-600"}`}>
                    {(product.countInStock ?? 0) < 10
                      ? `Only ${product.countInStock} left in stock`
                      : "In Stock"}
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-destructive">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground text-sm leading-relaxed border-t border-border/50 pt-4">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.skinTypes?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                  Skin Type:
                </span>
                {product.skinTypes.map((s) => (
                  <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border/50">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Concerns */}
            {product.concerns?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                  Concerns:
                </span>
                {product.concerns.map((c) => (
                  <span key={c} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border/50">
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2 border-t border-border/50 pt-5">
              {/* Qty */}
              <div className="flex items-center border border-border/60 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.countInStock ?? 99, q + 1))}
                  className="w-10 h-12 flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || !inStock}
                className="flex-1 h-12 text-sm font-bold tracking-widest uppercase rounded-xl shadow-md"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CartIcon className="w-4 h-4 mr-2" />
                )}
                {isAdding ? "Adding..." : !inStock ? "Out of Stock" : "Add to Cart"}
              </Button>

              {/* Fav */}
              <button
                onClick={handleToggleFavorite}
                disabled={isFavoriting || favStatus === "loading"}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                className={`h-12 w-12 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                  isFavorited
                    ? "border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-500"
                    : "border-border hover:border-rose-400 hover:text-rose-500"
                }`}
              >
                <FavIcon className={`w-5 h-5 transition-colors ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
              </button>
            </div>

            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <details className="group border border-border/50 rounded-xl px-4 py-3 cursor-pointer">
                <summary className="text-xs font-bold uppercase tracking-widest text-muted-foreground list-none flex items-center justify-between select-none">
                  Key Ingredients
                  <ChevronLeft className="w-4 h-4 rotate-90 transition-transform group-open:-rotate-90" />
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.ingredients.map((ing) => (
                    <span key={ing} className="text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                      {ing}
                    </span>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>

        {/* ── Recommended / You May Also Like ── */}
        {recommended.length > 0 && (
          <section className="mt-20 md:mt-28">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/70 mb-2">
                  From the Same Collection
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-foreground">You May Also Like</h2>
              </div>
              <Link
                to={`/shop?category=${categorySlug}`}
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors pb-0.5 border-b border-transparent hover:border-primary shrink-0"
              >
                View All →
              </Link>
            </div>

            {/* Carousel wrapper — extra side padding on sm+ for arrow buttons */}
            <div className="relative sm:px-10">
              <Carousel
                opts={{ align: "start", loop: true, dragFree: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-3 md:-ml-5">
                  {recommended.map((item) => (
                    <CarouselItem
                      key={item._id}
                      className="pl-3 md:pl-5 basis-[78%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <ProductCard product={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Arrows — hidden on mobile */}
                <CarouselPrevious className="hidden sm:flex -left-3 border-border bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm" />
                <CarouselNext className="hidden sm:flex -right-3 border-border bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm" />
              </Carousel>

              {/* Mobile swipe hint */}
              <p className="sm:hidden text-center text-[10px] text-muted-foreground/50 tracking-widest uppercase mt-4">
                ← Swipe to browse →
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
