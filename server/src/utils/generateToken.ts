import jwt from "jsonwebtoken";


export const generateToken = (userId: string) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ _id: userId }, JWT_SECRET!, {
    expiresIn: "1h",
  });
};
