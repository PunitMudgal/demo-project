import express from "express";
import { getUsers } from "../controllers/admin.js";

const router = express.Router();

router.get("/", getUsers);
// router.get()

export default router;
