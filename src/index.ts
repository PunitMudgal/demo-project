import express from "express";
import dotenv from "dotenv";
import connectToDB from "./lib/ConnectDB.js";
import authRouter from "./router/auth.js";
dotenv.config();

const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/api/auth", authRouter);
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
