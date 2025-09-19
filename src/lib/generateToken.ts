import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "../common/index.js";

const generateToken = (userId: any, isAdmin: Boolean) => {
  const token = jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET!, {
    expiresIn: Number(JWT_EXPIRES_IN),
  });
  return token;
};
export default generateToken;
