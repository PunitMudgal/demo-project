import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface AdminPayload extends JwtPayload {
  userId: string;
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
      return res.status(401).json({ messgae: "Token not found!" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not found!" });

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;
    if (decode.isAdmin) {
      next();
    } else
      return res
        .status(401)
        .json({ message: "You are not eligible to access this information" });
  } catch (error) {
    res.status(401).json({ message: "Admin authntication failed: ", error });
  }
};

export default adminMiddleware;
