import { z } from "zod";

const registerSchema = z.object({
  first_name: z.string().min(3).max(40),
  last_name: z.string().min(3).max(40).optional(),
  email: z.string().email(),
  password: z.string().min(3).max(60),
  about: z.string().min(10).max(500),
  address: z
    .object({
      street_name: z.string().max(100).optional(),
      pincode: z.number().optional(),
      state: z.string(),
      country: z.string(),
    })
    .optional(),
  is_admin: z.boolean().default(false),
  gender: z.enum(["male", "female"]),
  date_of_birth: z.string().transform((str) => new Date(str)), // Handles string dates
  education_qualification: z.string().optional(),
  profile_photo: z.string().optional(),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export { registerSchema, loginSchema };
