import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order";
import Category from "../models/Category";
import Blog from "../models/Blog";

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    userCount,
    productCount,
    orderCount,
    categoryCount,
    blogCount,
    recentOrders,
    totalRevenue,
    totalRevenueTrend
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Category.countDocuments(),
    Blog.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "firstname lastname email"),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]),
    Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.status(200).json({
    stats: {
      users: userCount,
      products: productCount,
      orders: orderCount,
      categories: categoryCount,
      blogs: blogCount,
      revenue: totalRevenue[0]?.total || 0,
    },
    recentOrders,
    revenueTrend: totalRevenueTrend
  });
});
