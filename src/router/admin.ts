import express from "express";
import { deleteAllUsers, getUser, getAllUsers } from "../controllers/admin.js";

const router = express.Router();

router.get("/:id", getUser); //  get a user by id
router.get("/", getAllUsers); // get all users
router.delete("/delete-all", deleteAllUsers); // delete all users

export default router;
