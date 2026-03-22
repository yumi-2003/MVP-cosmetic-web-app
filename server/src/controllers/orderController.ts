import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import {
  createOrder,
  createOrderFromCart,
  getOrderById,
  getOrdersByUser,
} from "../services/orderService";

const getOwnerFromRequest = (req: Request) => {
  const userId = req.header("x-user-id") || undefined;
  const sessionId = req.header("x-session-id") || undefined;

  if (!userId && !sessionId) {
    throw new ApiError(400, "x-user-id or x-session-id header is required");
  }

  return { userId, sessionId };
};

export const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const owner = getOwnerFromRequest(req);
  const items = (req.body?.items || []) as { productId: string; quantity: number }[];
  const shippingAddress = req.body?.shippingAddress;
  const distanceKm = req.body?.distanceKm || 0;

  const order =
    items.length > 0
      ? await createOrder(owner, items, shippingAddress, distanceKm)
      : await createOrderFromCart(owner, shippingAddress, distanceKm);

  res.status(201).json(order);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await getOrderById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  res.status(200).json(order);
});

export const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await getOrdersByUser(req.params.userId);
  res.status(200).json(orders);
});
