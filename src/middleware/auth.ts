import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { ObjectId } from "mongoose";
import { ErrorMessages } from "../common/messages.js";
import { StatusCodes } from "http-status-codes";

interface CustomJwtPayload extends JwtPayload {
  userId: ObjectId;
  isAdmin: Boolean;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        status_code: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.TOKEN_NOT_FOUND,
        error: authHeader,
      });
    }
    const token = authHeader.split(" ")[1];

    if (!token)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        status_code: StatusCodes.NOT_FOUND,
        message: ErrorMessages.UNAUTHORIZED,
      });

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;
    if (!decode)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        status_code: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.AUTHENTICATION_FAILED,
      });
    // console.log("decoded in middleware: ", decode);
    (req.userId = decode.userId), (req.isAdmin = decode.isAdmin), next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

export default authMiddleware;
