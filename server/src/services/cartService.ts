import Order, { OrderDocument, OrderItem } from "../models/Order";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";
import { calculateTotals } from "../utils/calculateTotals";

export interface CartOwner {
  userId?: string;
  sessionId?: string;
}

const ownerFilter = (owner: CartOwner) => {
  if (owner.userId) return { user: owner.userId };
  if (owner.sessionId) return { sessionId: owner.sessionId };
  throw new ApiError(400, "Cart owner is required");
};

const getCart = async (owner: CartOwner) => {
  const filter = ownerFilter(owner);
  return Order.findOne({ ...filter, status: "cart" });
};

const getOrCreateCart = async (owner: CartOwner) => {
  const existing = await getCart(owner);
  if (existing) return existing;

  const filter = ownerFilter(owner);
  return Order.create({ ...filter, status: "cart", items: [] });
};

const recalcTotals = async (cart: OrderDocument) => {
  const totals = calculateTotals(cart.items);
  cart.subtotal = totals.subtotal;
  cart.tax = totals.tax;
  cart.shipping = totals.shipping;
  cart.total = totals.total;
  await cart.save();
  return cart;
};

export const getCartForOwner = async (owner: CartOwner) => {
  const cart = await getOrCreateCart(owner);
  return cart;
};

export const addItemToCart = async (
  owner: CartOwner,
  productId: string,
  quantity: number
) => {
  const product = await Product.findById(productId).lean();
  if (!product) throw new ApiError(404, "Product not found");

  const cart = await getOrCreateCart(owner);
  const existing = cart.items.find((item) => item.product.toString() === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    const newItem: OrderItem = {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0],
    };
    cart.items.push(newItem);
  }

  return recalcTotals(cart);
};

export const updateCartItem = async (
  owner: CartOwner,
  productId: string,
  quantity: number
) => {
  const cart = await getOrCreateCart(owner);
  const item = cart.items.find((entry) => entry.product.toString() === productId);
  if (!item) throw new ApiError(404, "Cart item not found");

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (entry) => entry.product.toString() !== productId
    );
  } else {
    item.quantity = quantity;
  }

  return recalcTotals(cart);
};

export const removeCartItem = async (owner: CartOwner, productId: string) => {
  const cart = await getOrCreateCart(owner);
  cart.items = cart.items.filter((entry) => entry.product.toString() !== productId);
  return recalcTotals(cart);
};
