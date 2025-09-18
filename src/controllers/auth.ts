import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schema/userSchema.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../lib/generateToken.js";
import { tr } from "zod/locales";

const registerUser = async (req: Request, res: Response) => {
  const parsedData = registerSchema.parse(req.body);
  //   const {
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     about,
  //     address,
  //     isAdmin,
  //     gender,
  //     dateOfBirth,
  //     educationQualification,
  //   } = parsedData;
  const { email, password } = parsedData;

  try {
    // check if the user already exists
    const isAvailable = await User.findOne({ email });
    if (isAvailable)
      return res.status(500).json({ message: "User already exist!" });

    const salt = await bcrypt.genSalt(6);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const newUser = await User.create({
      ...parsedData,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser._id);

      res.status(201).json({ message: "user created!", token, newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server Error: ", error });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const { email, password } = parsedData;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Invalid credentials!" });

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res.status(401).json({ message: "Wrong email or password" });

    // const userWithoutPassword = { ...user.toObject(), password: undefined };

    const token = generateToken(user._id);
    res.status(200).json({ message: "Signin", token, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error: ", error });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};

// const logoutUser = async (req: Request, res: Response) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];

//   } catch (error) {

//   }
// }
export { registerUser, loginUser };
