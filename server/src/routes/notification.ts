import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController";

const router = express.Router();

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

export default router;
