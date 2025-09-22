import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "../common/index.js";

const generateToken = (userId: any, isAdmin: Boolean) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || "7d",
  });
  return token;
};
export default generateToken;
