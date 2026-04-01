import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, Loader2 } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { CartIcon, FavIcon, StarIcon } from "@/components/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearSelectedProduct,
  fetchProductBySlug,
  fetchProducts,
} from "@/redux/slices/productSlice";
import { addReview, fetchReviewsByProductId } from "@/redux/slices/reviewSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { toggleFavorite } from "@/redux/slices/favoriteSlice";
import type { IReview, IUser } from "@/redux/types";
import { trackRecentlyViewedProductId } from "@/lib/recommendationHistory";

const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="mb-8 h-4 w-40" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-3">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-20 w-20 rounded-xl" />
            ))}
          </div>
        </div>
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
          <Skeleton className="mt-6 h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const getUserId = (user?: string | IUser | null) => {
  if (!user) return "";
  if (typeof user === "string") return user;
  return user._id ?? user.id ?? "";
};

const getReviewAuthorName = (review: IReview) => {
  if (review.name?.trim()) return review.name.trim();
  if (!review.user || typeof review.user === "string") return "Customer";

  return `${review.user.firstname} ${review.user.lastname}`.trim() || "Customer";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const formatReviewDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    selectedProduct: product,
    status,
    items: allProducts,
  } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.auth);
  const { itemIds, status: favoriteStatus } = useAppSelector(
    (state) => state.favorites
  );
  const isAdmin = user?.isAdmin ?? false;
  const {
    productReviews,
    status: reviewStatus,
  } = useAppSelector((state) => state.reviews);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const productId = product?._id;
  const reviews = productId ? productReviews[productId] ?? [] : [];
  const currentUserId = getUserId(user);
  const isFavorited = product ? itemIds.includes(product._id) : false;
  const hasReviewed = Boolean(
    currentUserId &&
      reviews.some((review) => getUserId(review.user) === currentUserId)
  );

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
  }, [allProducts.length, dispatch, id]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchReviewsByProductId(productId));
      setActiveImage(0);
      setQuantity(1);
      trackRecentlyViewedProductId(productId);
    }
  }, [dispatch, productId]);

  const sameCategory = allProducts.filter((item) => {
    if (!product) return false;
    if (item._id === product._id) return false;

    const itemCategory =
      typeof item.category === "string" ? item.category : item.category._id;
    const productCategory =
      typeof product.category === "string"
        ? product.category
        : product.category._id;

    return itemCategory === productCategory;
  });

  const recommended = (
    sameCategory.length >= 4
      ? sameCategory
      : [
          ...sameCategory,
          ...allProducts.filter(
            (item) =>
              item._id !== product?._id &&
              !sameCategory.find((candidate) => candidate._id === item._id)
          ),
        ]
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
      toast.success(`${product.name} added to cart`, {
        action: { label: "View Cart", onClick: () => navigate("/cart") },
        duration: 4000,
      });
    } catch (error: any) {
      toast.error(error || "Failed to add to cart");
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
      const response = await dispatch(toggleFavorite(product)).unwrap();

      if (response.message === "Product added to favorites") {
        toast.success(`${product.name} added to favorites`);
      } else {
        toast.info(`${product.name} removed from favorites`);
      }
    } catch (error: any) {
      toast.error(error || "Failed to update favorites");
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      toast.error("Please log in to write a review", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      return;
    }

    if (!product) return;

    try {
      setIsSubmittingReview(true);
      await dispatch(
        addReview({
          productId: product._id,
          rating: reviewRating,
          comment: reviewComment.trim() || undefined,
        })
      ).unwrap();

      setReviewRating(5);
      setReviewComment("");
      toast.success("Your review has been published");
    } catch (error: any) {
      toast.error(error || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (status === "loading") return <ProductDetailSkeleton />;

  if (status === "failed" || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="font-serif text-2xl">Product not found</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          We could not find this product. It may have been removed or the link
          is incorrect.
        </p>
        <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
      </div>
    );
  }

  const hasDiscount =
    Boolean(product.comparePrice) && product.comparePrice! > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) * 100
      )
    : 0;
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category.name;
  const categorySlug =
    typeof product.category === "string"
      ? product.category
      : product.category.slug;
  const inStock = (product.countInStock ?? 0) > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="transition-colors hover:text-foreground">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${categorySlug}`}
            className="transition-colors hover:text-foreground"
          >
            {categoryName}
          </Link>
          <span>/</span>
          <span className="line-clamp-1 font-medium text-foreground">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-4">
            <div className="group relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
                  -{discountPct}%
                </span>
              )}
              {product.isBestSeller && (
                <span className="absolute right-4 top-4 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground shadow">
                  Best Seller
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image + index}
                    onClick={() => setActiveImage(index)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                      activeImage === index
                        ? "scale-105 border-primary shadow-md"
                        : "border-border opacity-70 hover:border-primary/50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70">
                {categoryName}
              </span>
              {product.isNew && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                  New
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`h-4 w-4 ${
                      index < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground opacity-60 line-through">
                    ${product.comparePrice?.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span
                    className={`text-sm font-medium ${
                      (product.countInStock ?? 0) < 10
                        ? "text-secondary font-bold"
                        : "text-primary"
                    }`}
                  >
                    {(product.countInStock ?? 0) < 10
                      ? `Only ${product.countInStock} left in stock`
                      : "In Stock"}
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-destructive">
                  Out of Stock
                </span>
              )}
            </div>

            {product.description && (
              <p className="border-t border-border/50 pt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {product.skinTypes?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Skin Type:
                </span>
                {product.skinTypes.map((skinType) => (
                  <span
                    key={skinType}
                    className="rounded-full border border-border/50 bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                  >
                    {skinType}
                  </span>
                ))}
              </div>
            )}

            {product.concerns?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Concerns:
                </span>
                {product.concerns.map((concern) => (
                  <span
                    key={concern}
                    className="rounded-full border border-border/50 bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            )}

            {isAdmin ? (
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-border/50 bg-muted/60 px-5 py-4 text-sm text-muted-foreground">
                <span className="text-xl">🚫</span>
                <div>
                  <p className="font-semibold text-foreground">Admin accounts cannot purchase</p>
                  <p className="text-xs mt-0.5">Switch to a regular customer account to shop.</p>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-3 border-t border-border/50 pt-5 sm:flex-row">
                <div className="flex items-center overflow-hidden rounded-xl border border-border/60">
                  <button
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                    className="flex h-14 sm:h-12 w-12 sm:w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    -
                  </button>
                  <span className="w-12 sm:w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(product.countInStock ?? 99, value + 1)
                      )
                    }
                    className="flex h-14 sm:h-12 w-12 sm:w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    +
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding || !inStock}
                  className="h-14 sm:h-12 flex-1 rounded-xl px-12 sm:px-8 text-sm font-bold uppercase tracking-widest shadow-md"
                >
                  {isAdding ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CartIcon className="mr-2 h-4 w-4" />
                  )}
                  {isAdding ? "Adding..." : !inStock ? "Out of Stock" : "Add to Cart"}
                </Button>

                <button
                  onClick={handleToggleFavorite}
                  disabled={isFavoriting || favoriteStatus === "loading"}
                  title={
                    isFavorited
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  className={`flex h-14 sm:h-12 w-14 sm:w-12 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 disabled:opacity-50 ${
                    isFavorited
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  <FavIcon
                    className={`h-5 w-5 transition-colors ${
                      isFavorited ? "fill-primary text-primary" : ""
                    }`}
                  />
                </button>
              </div>
            )}

            {product.ingredients?.length > 0 && (
              <details className="group cursor-pointer rounded-xl border border-border/50 px-4 py-3">
                <summary className="flex list-none items-center justify-between select-none text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Key Ingredients
                  <ChevronLeft className="h-4 w-4 rotate-90 transition-transform group-open:-rotate-90" />
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs text-primary"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>

        <section className="mt-20 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70">
              Customer Reviews
            </p>
            <h2 className="font-serif text-2xl text-foreground">
              Share your thoughts
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Reviews are visible to everyone on this product page. Once posted,
              they are read-only for other shoppers.
            </p>

            <div className="mt-6 rounded-2xl border border-border/60 bg-background/80 p-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    {product.rating.toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Based on {product.reviewCount} reviews
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`h-5 w-5 ${
                        index < Math.round(product.rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {!user ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 p-5">
                <p className="text-sm text-muted-foreground">
                  Sign in to leave a review for this product.
                </p>
                <Button className="mt-4" onClick={() => navigate("/login")}>
                  Login to Review
                </Button>
              </div>
            ) : hasReviewed ? (
              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-primary dark:border-primary/30 dark:bg-primary/10 dark:text-primary-foreground">
                You have already reviewed this product. Your review stays visible
                to other shoppers, but there is no edit or delete action here.
              </div>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleSubmitReview}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Your rating
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReviewRating(value)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
                          reviewRating === value
                            ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                            : "border-border bg-background hover:border-primary hover:text-foreground"
                        }`}
                      >
                        <StarIcon
                          className={`h-4 w-4 ${
                            value <= reviewRating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/40"
                          }`}
                        />
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="review-comment"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Your review
                  </label>
                  <textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={5}
                    maxLength={600}
                    placeholder="Tell other shoppers what you liked about this product."
                    className="w-full rounded-2xl border border-input bg-transparent px-3 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {reviewComment.length}/600 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="h-11 rounded-xl px-5 font-semibold"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Review"
                  )}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70">
                  What Shoppers Say
                </p>
                <h2 className="font-serif text-2xl text-foreground">
                  Recent reviews
                </h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {reviews.length} shown
              </span>
            </div>

            {reviewStatus === "loading" && reviews.length === 0 ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-border/60 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="mt-4 h-4 w-24" />
                    <Skeleton className="mt-4 h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-5/6" />
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => {
                const authorName = getReviewAuthorName(review);

                return (
                  <article
                    key={review._id}
                    className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg">
                          <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {authorName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatReviewDate(review.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            className={`h-4 w-4 ${
                              index < review.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-foreground/85">
                      {review.comment?.trim() || "Rated this product without a written comment."}
                    </p>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <h3 className="font-medium text-foreground">
                  No reviews yet
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Be the first shopper to share feedback for this product.
                </p>
              </div>
            )}
          </div>
        </section>

        {recommended.length > 0 && (
          <section className="mt-20 md:mt-28">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-primary/70">
                  From the Same Collection
                </p>
                <h2 className="font-serif text-2xl text-foreground md:text-3xl">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={`/shop?category=${categorySlug}`}
                className="shrink-0 border-b border-transparent pb-0.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                View All
              </Link>
            </div>

            <div className="relative sm:px-10">
              <Carousel
                opts={{ align: "start", loop: true, dragFree: true }}
                className="w-full"
              >
                <CarouselContent className="-ml-3 md:-ml-5">
                  {recommended.map((item) => (
                    <CarouselItem
                      key={item._id}
                      className="basis-[78%] pl-3 sm:basis-1/2 md:basis-1/3 md:pl-5 lg:basis-1/4"
                    >
                      <ProductCard product={item} />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="hidden -left-3 border-border bg-background/80 shadow-sm backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground sm:flex" />
                <CarouselNext className="hidden -right-3 border-border bg-background/80 shadow-sm backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground sm:flex" />
              </Carousel>

              <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground/50 sm:hidden">
                Swipe to browse
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
