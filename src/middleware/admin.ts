import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ErrorMessages } from "../common/messages.js";
import type { ObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";

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
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        status_code: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.TOKEN_NOT_FOUND,
        error: authHeader,
      });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        status_code: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.TOKEN_NOT_FOUND,
      });

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;

    if (!decode)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        status_code: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.AUTHENTICATION_FAILED,
      });

    (req.userId = decode.userId), (req.isAdmin = decode.isAdmin);

    if (decode.isAdmin) {
      next();
    } else
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        status_code: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.PERMISSION_NOT_FOUND,
      });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.ADMIN_AUTH_FAILED,
      error,
    });
  }
};

export default adminMiddleware;
