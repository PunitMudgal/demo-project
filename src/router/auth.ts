import express from "express";
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.js";

import upload from "../lib/multer.js";
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserRegister'
 * responses:
 * 201:
 * description: User registered successfully
 * 500:
 * description: Server error
 */
router.post("/register", upload.single("profile_photo"), registerUser);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Login a user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserLogin'
 * responses:
 * 200:
 * description: User logged in successfully
 * 404:
 * description: User not found
 * 500:
 * description: Server error
 */
router.post("/login", loginUser);

router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
