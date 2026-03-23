export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
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
  user: string | IUser;
  items: { product: string | IProduct; name: string; quantity: number; price: number; image?: string; }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReview {
  _id: string;
  user: string | IUser;
  product: string | IProduct;
  rating: number;
  comment: string;
  createdAt: string;
}
