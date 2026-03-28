import { Response } from "express";
import { AuthRequest } from "../middleware/protect";
import User from "../models/User";
import Product from "../models/Product";

// @desc    Toggle favorite product
// @route   POST /api/users/favorites/:productId
// @access  Private
export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const productId = req.params.productId;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const isFavorited = user.favorites.includes(product._id);

    if (isFavorited) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== product._id.toString()
      );
    } else {
      user.favorites.push(product._id);
    }

    await user.save();

    res.status(200).json({
      message: isFavorited
        ? "Product removed from favorites"
        : "Product added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId).populate("favorites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { firstname, lastname, email } = req.body;

    const user = await User.findById(userId);

    if (user) {
      user.firstname = firstname || user.firstname;
      user.lastname = lastname || user.lastname;
      user.email = email || user.email;

      if (req.file) {
        user.profileImage = (req.file as any).path;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};
