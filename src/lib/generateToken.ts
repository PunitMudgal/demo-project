import jwt from "jsonwebtoken";

const generateToken = (userId: any, isAdmin: boolean): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  const payload = {
    userId,
    isAdmin,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn,
    algorithm: "HS256",
  } as any);

  return token;
};

export default generateToken;
