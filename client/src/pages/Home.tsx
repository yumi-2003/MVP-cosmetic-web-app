import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/redux/slices/productSlice";
import BrandcommimentSection from "@/components/BrandcommimentSection";
import Hero from "@/components/layout/hero/Hero";
import ProductGrid from "@/components/product/ProductGrid";
import { Loader2 } from "lucide-react";

const Home = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products || { items: [], status: "idle" });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts({}));
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // First 4 items as best sellers, next 4 as featured
  const bestSellers = items.slice(0, 4);
  const featured = items.slice(4, 8);

  return (
    <>
      <Hero />
      <ProductGrid title="Best Sellers" products={bestSellers} />
      <BrandcommimentSection />
      <ProductGrid title="Featured Products" products={featured} />
    </>
  );
};

export default Home;
