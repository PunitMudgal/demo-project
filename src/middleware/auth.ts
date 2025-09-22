import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { ObjectId } from "mongoose";
import { ErrorMessages } from "../common/messages.js";

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
      return res
        .status(401)
        .json({
          status: "error",
          message: ErrorMessages.TOKEN_NOT_FOUND,
          error: authHeader,
        });
    }
    const token = authHeader.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json({ status: "error", message: ErrorMessages.TOKEN_NOT_FOUND });

    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as CustomJwtPayload;
    if (!decode)
      return res
        .status(401)
        .json({
          status: "error",
          message: ErrorMessages.AUTHENTICATION_FAILED,
        });
    // console.log("decoded in middleware: ", decode);
    (req.userId = decode.userId), (req.isAdmin = decode.isAdmin), next();
  } catch (error) {
    res.status(500).json({
      message: "server error while checking the authenticaiton:",
      error,
    });
  }
};

export default authMiddleware;
