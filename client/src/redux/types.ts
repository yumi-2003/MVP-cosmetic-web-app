export interface IUser {
  _id: string;
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  category: string | ICategory;
  images: string[];
  tags: string[];
  skinTypes: string[];
  concerns: string[];
  ingredients: string[];
  routineStep?: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  countInStock: number;
}

export interface IRecommendationStep {
  title: string;
  description: string;
}

export interface IProductRecommendation {
  product: IProduct;
  score: number;
  confidence: number;
  reasons: string[];
}

export interface IRecommendationSummary {
  skinType: string | null;
  concerns: string[];
  toneHex: string | null;
  undertone: "warm" | "cool" | "neutral" | "olive" | null;
  behaviorSignals: number;
  preferredCategory: string | null;
}

export interface IRecommendationResponse {
  summary: IRecommendationSummary;
  steps: IRecommendationStep[];
  recommendations: IProductRecommendation[];
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ICartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICart {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface IOrder {
  _id: string;
  user?: string | IUser;
  items: {
    product: string | IProduct;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  status: "cart" | "placed" | "paid" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  placedAt?: string;
  createdAt: string;
  updatedAt: string;
  delivery?: {
    status:
      | "pending"
      | "processing"
      | "shipped"
      | "out_for_delivery"
      | "delivered"
      | "failed"
      | "returned";
    trackingNumber?: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  } | null;
}

export interface IReview {
  _id: string;
  user?: string | IUser;
  product: string | IProduct;
  rating: number;
  comment?: string;
  name?: string;
  createdAt: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorId?: string;
  image: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
