import express, { response, type Request, type Response } from "express";
import dotenv from "dotenv";
import connectToDB from "./lib/ConnectDB.js";
import authRouter from "./router/auth.js";
import userRouter from "./router/user.js";
import adminRouter from "./router/admin.js";
import authMiddleware from "./middleware/auth.js";
import adminMiddleware from "./middleware/admin.js";
dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.get("/", authMiddleware, (req: Request, res: Response) => {
  res.status(200).send("All okay and working fine!");
});

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", authMiddleware, userRouter);
app.use("api/admin", adminMiddleware, adminRouter);
// app.use("/api/user");
// app.use("/api/");

// todo: create the error middleware

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
