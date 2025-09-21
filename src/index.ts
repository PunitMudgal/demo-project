import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import connectToDB from "./lib/ConnectDB.js";
import authRouter from "./router/auth.js";
import userRouter from "./router/user.js";
import adminRouter from "./router/admin.js";
import authMiddleware from "./middleware/auth.js";
// import adminMiddleware from "./middleware/admin.js";

import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
swaggerJSDoc(app); //swagger

// middlewares
app.use(express.json());

app.get("/", authMiddleware, (req: Request, res: Response) => {
  res // for testing purpose only
    .status(200)
    .json({ message: "All okay", userId: req.userId, isAdmin: req.isAdmin });
});

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", authMiddleware, userRouter);
app.use("/api/admin", authMiddleware, adminRouter);

// connect to db & server
const port = process.env.PORT || 4040;
connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log("server created at port: ", port);
    });
  })
  .catch((error) => {
    console.log("error occured while creating the server: ", error);
  });
