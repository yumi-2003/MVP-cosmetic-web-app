import mongoose, { ClientSession } from "mongoose";
import Order, {
  ORDER_STATUSES,
  OrderItem,
  OrderStatus,
} from "../models/Order";
import Shipping, { IShippingAddress } from "../models/Shipping";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";
import { calculateTotals } from "../utils/calculateTotals";
import type { CartOwner } from "./cartService";
import { clearCartForOwner } from "./cartService";
import { createNotification } from "../controllers/notificationController";

//owen filter to make sure this cart is made by logged-in user or guest user
const ownerFilter = (owner: CartOwner) => {
  if (owner.userId) return { user: owner.userId };
  if (owner.sessionId) return { sessionId: owner.sessionId };
  return {};
};

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  cart: ["placed"],
  placed: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

const isOrderStatus = (status: string): status is OrderStatus =>
  ORDER_STATUSES.includes(status as OrderStatus);

const assertValidOrderStatusTransition = (
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
) => {
  if (currentStatus === nextStatus) return;

  const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus];
  if (allowedTransitions.includes(nextStatus)) return;

  const allowedLabel =
    allowedTransitions.length > 0 ? allowedTransitions.join(", ") : "none";

  throw new ApiError(
    400,
    `Invalid order status transition from ${currentStatus} to ${nextStatus}. Allowed next statuses: ${allowedLabel}.`,
  );
};

const withMongoTransaction = async <T>(
  operation: (session: ClientSession) => Promise<T>,
) => {
  const session = await mongoose.startSession();

  try {
    let result!: T;

    await session.withTransaction(async () => {
      result = await operation(session);
    });

    return result;
  } finally {
    await session.endSession();
  }
};

//create real order from cart
export const createOrderFromCart = async (
  owner: CartOwner,
  shippingAddress?: IShippingAddress,
  distanceKm: number = 0,
) => {
  return withMongoTransaction(async (session) => {
    //get cart owener
    const filter = ownerFilter(owner);
    //get cart status that is only active
    const cart = await Order.findOne({ ...filter, status: "cart" }).session(
      session,
    );
    //prevent empty cart
    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    // Synchronize cart items with valid products
    const productIds = cart.items.map((item) => item.product.toString());
    const products = await Product.find({ _id: { $in: productIds } })
      .session(session)
      .lean();
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    cart.items = (cart.items as any).filter((item: any) =>
      productMap.has(item.product.toString()),
    );
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

    await reserveStockForItems(cart.items, session);

    const totals = calculateTotals(cart.items, distanceKm);

    cart.subtotal = totals.subtotal;
    cart.tax = totals.tax;
    cart.shipping = totals.shipping;
    cart.total = totals.total;
    cart.status = "placed";
    cart.placedAt = new Date();
    await cart.save({ session });

    if (shippingAddress) {
      const shipping = new Shipping({
        order: cart._id,
        address: shippingAddress,
        distanceKm,
      });
      await shipping.save({ session });
    }

    // Notify Admin
    createNotification({
      message: `A new order (${cart._id.toString().slice(-6)}) has been placed!`,
      type: "order",
      relatedId: cart._id.toString()
    });

    return cart;
  });
};

const buildOrderItems = async (
  items: { productId: string; quantity: number }[],
  session: ClientSession,
) => {
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } })
    .session(session)
    .lean();

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

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
      }),
    )
  ).filter((item): item is OrderItem => item !== null);

  return orderItems;
};

export const createOrder = async (
  owner: CartOwner,
  items: { productId: string; quantity: number }[],
  shippingAddress?: IShippingAddress,
  distanceKm: number = 0,
) => {
  if (!items.length) throw new ApiError(400, "Order items are required");

  return withMongoTransaction(async (session) => {
    const orderItems = await buildOrderItems(items, session);
    if (!orderItems.length) throw new ApiError(400, "Order items are invalid");

    await reserveStockForItems(orderItems, session);
    const totals = calculateTotals(orderItems, distanceKm);

    const order = new Order({
      ...ownerFilter(owner),
      items: orderItems,
      status: "placed",
      placedAt: new Date(),
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
    });
    await order.save({ session });

    if (shippingAddress) {
      const shipping = new Shipping({
        order: order._id,
        address: shippingAddress,
        distanceKm,
      });
      await shipping.save({ session });
    }

    // Clear existing cart document for this owner
    await clearCartForOwner(owner, session);

    // Notify Admin
    createNotification({
      message: `A new order (${order._id.toString().slice(-6)}) has been placed!`,
      type: "order",
      relatedId: order._id.toString()
    });

    return order;
  });
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
    deliveries.map((delivery) => [delivery.order.toString(), delivery]),
  );

  return orders.map((order) => ({
    ...order,
    delivery: deliveryMap.get(order._id.toString()) || null,
  }));
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (!isOrderStatus(status)) {
    throw new ApiError(
      400,
      `Invalid order status: ${status}. Valid statuses: ${ORDER_STATUSES.join(", ")}.`,
    );
  }

  const newStatus = status as OrderStatus;
  assertValidOrderStatusTransition(order.status, newStatus);
  order.status = newStatus;
  await order.save();
  return order;
};

export const listAllOrders = async (query: { page?: string, limit?: string, search?: string, status?: string } = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const skip = (page - 1) * limit;
  const search = query.search ? String(query.search) : "";
  const status = query.status ? String(query.status) : "";

  const filter: any = { status: { $ne: "cart" } };
  
  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search) {
    if (mongoose.Types.ObjectId.isValid(search)) {
      filter._id = search;
    } else {
      // In a real app, you might use aggregation to search user fields too.
      // For now, we filter by exact ID if valid, or just return based on status/page.
    }
  }

  const [data, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "firstname lastname email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
};

const reserveStockForItems = async (
  items: OrderItem[],
  session: ClientSession,
) => {
  for (const item of items) {
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, countInStock: { $gte: item.quantity } },
      { $inc: { countInStock: -item.quantity } },
      { new: true, session },
    );

    if (!updated) {
      const product = await Product.findById(item.product).session(session).lean();
      const available = product?.countInStock ?? 0;
      const name = product?.name ?? "this product";
      throw new ApiError(
        400,
        `Only ${available} items available in stock for ${name}`,
      );
    }
  }
};
