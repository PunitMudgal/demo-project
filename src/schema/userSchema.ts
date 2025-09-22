import { z } from "zod";

/**
 * @swagger
 * components:
 * schemas:
 * UserRegister:
 * type: object
 * required:
 * - first_name
 * - email
 * - password
 * - about
 * - gender
 * - date_of_birth
 * properties:
 * first_name:
 * type: string
 * last_name:
 * type: string
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 * about:
 * type: string
 * address:
 * type: object
 * properties:
 * street_name:
 * type: string
 * pincode:
 * type: number
 * state:
 * type: string
 * country:
 * type: string
 * is_admin:
 * type: boolean
 * gender:
 * type: string
 * enum: [male, female]
 * date_of_birth:
 * type: string
 * format: date
 * education_qualification:
 * type: string
 * profile_photo:
 * type: string
 * UserLogin:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 */

const registerSchema = z.object({
  first_name: z.string().min(3).max(20),
  last_name: z.string().max(20).optional(),
  email: z.string().email(),
  password: z.string().min(3).max(60),
  about: z.string().max(500),
  address: z
    .object({
      street_name: z.string().max(100).optional().default(""),
      pincode: z.number().optional().nullable().default(null),
      state: z.string().optional().default(""),
      country: z.string().optional().default(""),
    })
    .optional(),
  is_admin: z.boolean().default(false),
  gender: z.enum(["male", "female"]),
  date_of_birth: z.string().transform((str) => new Date(str)), // Handles string dates
  education_qualification: z.string().optional().default(""),
  profile_photo: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// update user schema
const updateUserSchema = z
  .object({
    first_name: z.string().min(3).max(40).optional(),
    last_name: z.string().max(40).optional(),
    about: z.string().max(500).optional(),
    address: z
      .object({
        street_name: z.string().max(100).optional(),
        pincode: z.number().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    gender: z.enum(["male", "female"]).optional(),
    date_of_birth: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    education_qualification: z.string().optional(),
    profile_photo: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// reset password schema
const requestPasswordResetSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

const resetPasswordSchema = z.object({
  password: z.string().min(3, { message: "Password is too short" }),
});

export {
  registerSchema,
  loginSchema,
  updateUserSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
};
