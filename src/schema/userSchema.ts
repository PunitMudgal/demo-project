import { z } from "zod";

const registerSchema = z.object({
  firstName: z.string().min(3).max(40),
  lastName: z.string().min(3).max(40).optional(),
  email: z.string().email(),
  password: z.string().min(3).max(60),
  about: z.string().min(10).max(500),
  address: z
    .object({
      streetName: z.string().max(100).optional(),
      pincode: z.number().optional(),
      state: z.string(),
      country: z.string(),
    })
    .optional(),
  isAdmin: z.boolean().default(false),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().transform((str) => new Date(str)), // Handles string dates
  educationQualification: z.string().optional(),
  profilePhoto: z.string().optional(),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export { registerSchema, loginSchema };
