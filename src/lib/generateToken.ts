import jwt from "jsonwebtoken";

const generateToken = (userId: any, isAdmin: Boolean) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ userId, isAdmin }, secret, { expiresIn });

  return token;
};

export default generateToken;
