import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schema/userSchema.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../lib/generateToken.js";
import { SuccessMessages, ErrorMessages } from "../common/messages.js";

const registerUser = async (req: Request, res: Response) => {
  const parsedData = registerSchema.parse(req.body);
  const { email, password } = parsedData;

  try {
    // check if the user already exists
    const isAvailable = await User.findOne({ email });
    if (isAvailable)
      return res.status(500).json({
        status: "error",
        message: ErrorMessages.USER_ALREADY_EXISTS,
      });

    const salt = await bcrypt.genSalt(6);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const newUser = await User.create({
      ...parsedData,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser._id, newUser.is_admin);

      res.status(201).json({
        status: "success",
        message: SuccessMessages.USER_REGISTERED_SUCCESSFULLY,
        data: {
          token,
          user: newUser,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      Status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

// login user
const loginUser = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const { email, password } = parsedData;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return res.status(401).json({
        status: "error",
        message: ErrorMessages.USER_NOT_FOUND,
      });

    // const userWithoutPassword = { ...user.toObject(), password: undefined };

    const token = generateToken(user._id, user.is_admin);
    res.status(200).json({
      status: "success",
      message: SuccessMessages.USER_PROFILE_RETRIEVED,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

// // /api/reset-password
// const resetPassword = async (req: Request, res: Response) => {
//   try {;
//     const {email} = req.body;
//     const user  = await User.findOne({email});

//     if(!user) return res.status(404).json({message: "User not found!"});

//     let token = await Token.findOne({userId: user._id});
//     if(!token) {
//       token = await new Token({
//         userId: user._id,
//         token: crypto.randomBytes(32).toString("hex"),
//       }).save();
//       }
//       const link = `${prooce}`
//   } catch (error) {}
// };

// const logoutUser = async (req: Request, res: Response) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];

//   } catch (error) {

//   }
// }
export { registerUser, loginUser };
