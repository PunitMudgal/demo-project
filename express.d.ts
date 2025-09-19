import { JwtPayload } from "jsonwebtoken";
import type { ObjectId } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId?: ObjectId;
      isAdmin?: Boolean; // or number, depending on your user ID type
      // you can add other custom properties here too
    }
  }
}
