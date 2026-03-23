import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
      try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload & { _id?: string };
      if (decoded && decoded._id) {
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
          return res.status(401).json({ message: "Not authorized, user not found" });
        }
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: "Not authorized, token failed" });
      }
    } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const optionalProtect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload & { _id?: string };
      if (decoded && decoded._id) {
        req.user = await User.findById(decoded._id).select("-password");
      }
    } catch (err) {
      // Ignore errors for optional protect
    }
  }
  next();
};
