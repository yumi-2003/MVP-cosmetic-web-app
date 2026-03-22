import Order, { OrderItem } from "../models/Order";
import Shipping, { IShippingAddress } from "../models/Shipping";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";
import { calculateTotals } from "../utils/calculateTotals";
import type { CartOwner } from "./cartService";

const ownerFilter = (owner: CartOwner) => {
  if (owner.userId) return { user: owner.userId };
  if (owner.sessionId) return { sessionId: owner.sessionId };
  return {};
};

export const createOrderFromCart = async (
  owner: CartOwner,
  shippingAddress?: IShippingAddress,
  distanceKm: number = 0
) => {
  const filter = ownerFilter(owner);
  const cart = await Order.findOne({ ...filter, status: "cart" });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const totals = calculateTotals(cart.items, distanceKm);

  cart.subtotal = totals.subtotal;
  cart.tax = totals.tax;
  cart.shipping = totals.shipping;
  cart.total = totals.total;
  cart.status = "placed";
  cart.placedAt = new Date();
  await cart.save();

  if (shippingAddress) {
    await Shipping.create({
      order: cart._id,
      address: shippingAddress,
      distanceKm,
    });
  }

  return cart;
};

const buildOrderItems = async (
  items: { productId: string; quantity: number }[]
) => {
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();

  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const orderItems: OrderItem[] = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images?.[0],
    };
  });

  return orderItems;
};

export const createOrder = async (
  owner: CartOwner,
  items: { productId: string; quantity: number }[],
  shippingAddress?: IShippingAddress,
  distanceKm: number = 0
) => {
  if (!items.length) throw new ApiError(400, "Order items are required");

  const orderItems = await buildOrderItems(items);
  const totals = calculateTotals(orderItems, distanceKm);

  const order = await Order.create({
    ...ownerFilter(owner),
    items: orderItems,
    status: "placed",
    placedAt: new Date(),
    subtotal: totals.subtotal,
    tax: totals.tax,
    shipping: totals.shipping,
    total: totals.total,
  });

  if (shippingAddress) {
    await Shipping.create({
      order: order._id,
      address: shippingAddress,
      distanceKm,
    });
  }

  return order;
};

export const getOrderById = async (orderId: string) => {
  return Order.findById(orderId).populate("items.product").lean();
};

export const getOrdersByUser = async (userId: string) => {
  return Order.find({ user: userId, status: { $ne: "cart" } })
    .sort({ createdAt: -1 })
    .lean();
};
