import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import {
  addItemToCart,
  getCartForOwner,
  removeCartItem,
  updateCartItem,
  type CartOwner,
} from "../services/cartService";

const getOwnerFromRequest = (req: any): CartOwner => {
  const userId = req.user?._id?.toString();
  
  if (!userId) {
    throw new ApiError(401, "User authentication required for cart operations");
  }

  return { userId };
};

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const owner = getOwnerFromRequest(req);
  const cart = await getCartForOwner(owner);
  res.status(200).json(cart);
});

export const addCartItem = asyncHandler(async (req: Request, res: Response) => {
  const owner = getOwnerFromRequest(req);
  const { productId, quantity } = req.body as {
    productId: string;
    quantity: number;
  };

  const cart = await addItemToCart(owner, productId, quantity);
  res.status(200).json(cart);
});

export const updateCartItemQuantity = asyncHandler(
  async (req: Request, res: Response) => {
    const owner = getOwnerFromRequest(req);
    const { quantity } = req.body as { quantity: number };

    const cart = await updateCartItem(owner, req.params.productId, quantity);
    res.status(200).json(cart);
  }
);

export const removeCartItemByProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const owner = getOwnerFromRequest(req);
    const cart = await removeCartItem(owner, req.params.productId);
    res.status(200).json(cart);
  }
);
