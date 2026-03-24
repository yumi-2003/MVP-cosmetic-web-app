import Order, { OrderItem } from "../models/Order";
import Shipping, { IShippingAddress } from "../models/Shipping";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";
import { calculateTotals } from "../utils/calculateTotals";
import type { CartOwner } from "./cartService";
import { clearCartForOwner } from "./cartService";

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

  // Synchronize cart items with valid products
  const productIds = cart.items.map((item) => item.product.toString());
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  cart.items = (cart.items as any).filter((item: any) => productMap.has(item.product.toString()));
  if (cart.items.length === 0) {
    throw new ApiError(400, "All items in your cart are no longer available");
  }

  // Update name/image/price to match current DB
  cart.items.forEach((item) => {
    const p = productMap.get(item.product.toString())!;
    item.name = p.name;
    item.price = p.price;
    item.image = p.images?.[0];
  });

  await reserveStockForItems(cart.items);

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

  const orderItems: OrderItem[] = (
    await Promise.all(
      items.map(async (item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;

        return {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images?.[0],
        } as OrderItem;
      })
    )
  ).filter((item): item is OrderItem => item !== null);

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
  if (!orderItems.length) throw new ApiError(400, "Order items are invalid");

  await reserveStockForItems(orderItems);
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

  // Clear existing cart document for this owner
  await clearCartForOwner(owner);

  return order;
};

export const getOrderById = async (orderId: string) => {
  return Order.findById(orderId).populate("items.product").lean();
};

export const getOrdersByUser = async (userId: string) => {
  const orders = await Order.find({ user: userId, status: { $ne: "cart" } })
    .sort({ createdAt: -1 })
    .lean();

  if (orders.length === 0) return orders;

  const orderIds = orders.map((order) => order._id);
  const deliveries = await Shipping.find({ order: { $in: orderIds } })
    .select("order status trackingNumber estimatedDelivery actualDelivery")
    .lean();

  const deliveryMap = new Map(
    deliveries.map((delivery) => [delivery.order.toString(), delivery])
  );

  return orders.map((order) => ({
    ...order,
    delivery: deliveryMap.get(order._id.toString()) || null,
  }));
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  const newStatus = status as any;

  order.status = newStatus;
  await order.save();
  return order;
};

const reserveStockForItems = async (items: OrderItem[]) => {
  const adjusted: Array<{ product: OrderItem["product"]; quantity: number }> = [];
  try {
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, countInStock: { $gte: item.quantity } },
        { $inc: { countInStock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        const product = await Product.findById(item.product).lean();
        const available = product?.countInStock ?? 0;
        const name = product?.name ?? "this product";
        throw new ApiError(400, `Only ${available} items available in stock for ${name}`);
      }

      adjusted.push({ product: item.product, quantity: item.quantity });
    }
  } catch (err) {
    if (adjusted.length) {
      await Promise.all(
        adjusted.map((item) =>
          Product.findByIdAndUpdate(item.product, {
            $inc: { countInStock: item.quantity },
          })
        )
      );
    }
    throw err;
  }
};
