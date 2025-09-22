import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ErrorMessages } from "../common/messages.js";
import type { ObjectId } from "mongoose";

interface AdminPayload extends JwtPayload {
  userId: ObjectId;
  isAdmin: boolean;
}

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({
        status: "error",
        messgae: ErrorMessages.TOKEN_NOT_FOUND,
        error: authHeader,
      });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ status: "error", message: ErrorMessages.TOKEN_NOT_FOUND });

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;

    if (!decode)
      return res
        .status(401)
        .json({
          status: "error",
          message: ErrorMessages.AUTHENTICATION_FAILED,
        });

    (req.userId = decode.userId), (req.isAdmin = decode.isAdmin);

    if (decode.isAdmin) {
      next();
    } else
      return res
        .status(401)
        .json({ status: "error", message: ErrorMessages.PERMISSION_NOT_FOUND });
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: ErrorMessages.ADMIN_AUTH_FAILED,
      error,
    });
  }
};

export default adminMiddleware;
