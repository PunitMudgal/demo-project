import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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

    const decode = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decode)
      return res.status(401).json({ message: "Authenticatoin failed!" });
    console.log("decoded in middleware: ", decode);

    next();
  } catch (error) {}
};

export default adminMiddleware;
