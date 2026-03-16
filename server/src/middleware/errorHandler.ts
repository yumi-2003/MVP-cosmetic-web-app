import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Server error";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
