import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProducts } from "@/redux/slices/productSlice";
import BrandcommimentSection from "@/components/BrandcommimentSection";
import Hero from "@/components/layout/hero/Hero";
import ProductGrid from "@/components/product/ProductGrid";

const Home = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products || { items: [], status: "idle" });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts({}));
    }
  }, [status, dispatch]);



  // First 8 items as best sellers, next 8 as featured
  const bestSellers = items.slice(0, 8);
  const featured = items.slice(4, 12);

  return (
    <>
      <Hero />
      <ProductGrid title="Best Sellers" subtitle="Our Top Picks" products={bestSellers} isLoading={status === "loading"} />
      <BrandcommimentSection />
      <ProductGrid title="Featured Products" subtitle="Curated For You" products={featured} isLoading={status === "loading"} />
    </>
  );
};

export default Home;
