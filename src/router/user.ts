import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUser);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
