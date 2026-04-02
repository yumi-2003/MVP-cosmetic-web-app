import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Notification from "../models/Notification";

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
  res.status(200).json(notifications);
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  res.status(200).json(notification);
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.status(200).json({ message: "All notifications marked as read" });
});

export const createNotification = async (data: { message: string; type: "order" | "user" | "inventory"; relatedId?: string }) => {
  try {
    return await Notification.create(data);
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
