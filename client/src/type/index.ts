export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  brand?: string;
  stock: number;
  rating: number;
  numReviews: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  isAdmin?: boolean;
  token?: string;
}
