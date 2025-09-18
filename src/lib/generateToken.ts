import jwt from "jsonwebtoken";

const generateToken = (userId: any, isAdmin: Boolean) => {
  const token = jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
  return token;
};
export default generateToken;
