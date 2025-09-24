import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { ObjectId } from "mongoose";
import { ErrorMessages } from "../common/messages.js";
import { StatusCodes } from "http-status-codes";
import { handleApiError } from "../common/returnResponse.js";

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
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.TOKEN_NOT_FOUND,
        StatusCodes.UNAUTHORIZED
      );
    }
    const token = authHeader.split(" ")[1];

    if (!token)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.TOKEN_NOT_FOUND,
        StatusCodes.UNAUTHORIZED
      );

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;
    if (!decode)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.AUTHENTICATION_FAILED,
        StatusCodes.UNAUTHORIZED
      );
    // console.log("decoded in middleware: ", decode);
    req.userId = decode.userId;
    req.isAdmin = decode.isAdmin;
    next();
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

export default authMiddleware;
