import type { Product } from "@/type";

export const products: Product[] = [
  {
    _id: "1",
    name: "Hydrating Face Cream",
    description: "Deep moisturizing skincare cream",
    price: 25,
    images: ["/assets/images/cream.jpg"],
    category: "skincare",
    brand: "GlowSkin",
    stock: 20,
    rating: 4.5,
    numReviews: 10,
  },
  {
    _id: "2",
    name: "Matte Lipstick",
    description: "Long lasting matte lipstick",
    price: 18,
    images: ["/assets/images/lipstick.jpg"],
    category: "makeup",
    brand: "BeautyPro",
    stock: 15,
    rating: 4.7,
    numReviews: 8,
  },
];
