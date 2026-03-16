import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { subscribeEmail } from "../services/newsletterService";

export const subscribeNewsletter = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };
    const result = await subscribeEmail(email);
    res.status(200).json(result);
  }
);
