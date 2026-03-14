import Hero from "@/components/layout/hero/Hero";
import ProductGrid from "@/components/product/ProductGrid";
import { products } from "@/data/products";

const Home = () => {
  // First 4 items as best sellers, next 4 as featured
  const bestSellers = products.slice(0, 4);
  const featured = products.slice(4, 8);

  return (
    <>
      <Hero />
      <ProductGrid title="Best Sellers" products={bestSellers} />
      <ProductGrid title="Featured Products" products={featured} />
    </>
  );
};

export default Home;
