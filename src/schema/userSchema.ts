import z from "zod";

const userSchema = z.object({
  firstName: z.string().min(3).max(40),
  lastName: z.string().min(3).max(40).optional(),
  email: z.email(),
  password: z.string().min(3).max(60),
  about: z.string().min(10).max(500),
  address: {
    streetName: z.string().max(100).optional(),
    pincode: z.number(),
    state: z.string(),
    country: z.string(),
  },
  isAdmin: z.boolean().default(false),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.date(),
  eduactionQualificatoin: z.string().optional(),
});
