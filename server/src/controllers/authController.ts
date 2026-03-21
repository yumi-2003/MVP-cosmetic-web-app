import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";

const signUp = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    //check if user aleardy exists
    const existingUser = await User.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
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
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        // isAdmin: newUser.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//login user
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //check if user exists
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    //create and assign a token
    const token = generateToken(user._id.toString());
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export { signUp, login, getMe };
