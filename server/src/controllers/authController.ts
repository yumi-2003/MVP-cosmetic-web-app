import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";

// @desc    Register a new user
// @route   POST /api/auth/signUp
// @access  Public
const signUp = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser: IUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    
    const token = generateToken(newUser._id.toString());
    
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create and assign a token
    const token = generateToken(user._id.toString());
    
    res.status(200).json({ 
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching user profile" });
  }
};

export { signUp, login, getMe };
