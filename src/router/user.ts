import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/user.js";
import upload from "../lib/multer.js";

const router = express.Router();

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the profile of the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 status_code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "User profile retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", getUser);

/**
 * @swagger
 * /api/user/update/{id}:
 *   patch:
 *     summary: Update user profile
 *     description: Update user profile information. Users can only update their own profile unless they are admin.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 40
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 maxLength: 40
 *                 example: "Doe"
 *               about:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Updated about section"
 *               address:
 *                 type: object
 *                 properties:
 *                   street_name:
 *                     type: string
 *                     maxLength: 100
 *                     example: "123 Updated St"
 *                   pincode:
 *                     type: number
 *                     example: 54321
 *                   state:
 *                     type: string
 *                     example: "New York"
 *                   country:
 *                     type: string
 *                     example: "USA"
 *               gender:
 *                 type: string
 *                 enum: ["male", "female"]
 *                 example: "male"
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-15"
 *               education_qualification:
 *                 type: string
 *                 example: "Master's in Computer Science"
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *                 description: New profile photo file
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 40
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 maxLength: 40
 *                 example: "Doe"
 *               about:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Updated about section"
 *               address:
 *                 type: object
 *                 properties:
 *                   street_name:
 *                     type: string
 *                     maxLength: 100
 *                   pincode:
 *                     type: number
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *               gender:
 *                 type: string
 *                 enum: ["male", "female"]
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               education_qualification:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 status_code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch("/update/:id", upload.single("profile_photo"), updateUser);

/**
 * @swagger
 * /api/user/delete/{id}:
 *   delete:
 *     summary: Delete user account
 *     description: Delete user account. Users can only delete their own account unless they are admin.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 status_code:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Invalid user ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 status_code:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid user ID format"
 *                 error:
 *                   type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/delete/:id", deleteUser);

export default router;
