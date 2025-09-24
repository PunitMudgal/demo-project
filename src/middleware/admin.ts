import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ErrorMessages } from "../common/messages.js";
import type { ObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { handleApiError } from "../common/returnResponse.js";

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
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.TOKEN_NOT_FOUND,
        StatusCodes.UNAUTHORIZED
      );

    const token = authHeader.split(" ")[1];
    if (!token)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.TOKEN_NOT_FOUND,
        StatusCodes.UNAUTHORIZED
      );

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;

    if (!decode)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.AUTHENTICATION_FAILED,
        StatusCodes.UNAUTHORIZED
      );
    req.userId = decode.userId;
    req.isAdmin = decode.isAdmin;

    if (decode.isAdmin) {
      next();
    } else
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.AUTHENTICATION_FAILED,
        StatusCodes.UNAUTHORIZED
      );
  } catch (error) {
    handleApiError(
      req,
      res,
      error,
      ErrorMessages.AUTHENTICATION_FAILED,
      StatusCodes.UNAUTHORIZED
    );
  }
};

export default adminMiddleware;
