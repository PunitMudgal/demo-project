import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
        .json({ message: "Authentication failed, Token not found!" });
    }
    const token = authHeader.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json({ message: "Authentication faile, token not found" });

    const decode = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decode)
      return res.status(401).json({ message: "Authentication failed: " });
    console.log("decoded in middleware: ", decode);
    // req.userId = decode.userId;
    next();
  } catch (error) {
    res.status(500).json({
      message: "server error while checking the authenticaiton:",
      error,
    });
  }
};

export default authMiddleware;
