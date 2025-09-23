import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

const generateToken = (userId: any, isAdmin: Boolean) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const signOptions: SignOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  };

  const token = jwt.sign({ userId, isAdmin }, secret as Secret, signOptions);

  return token;
};

export default generateToken;
