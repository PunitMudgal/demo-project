import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/", getUser);
router.patch("/update/:id", upload.single("profile_photo"), updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
