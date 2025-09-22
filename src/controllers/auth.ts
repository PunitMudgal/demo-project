import type { Request, Response } from "express";
import {
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../schema/userSchema.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import generateToken from "../lib/generateToken.js";
import { SuccessMessages, ErrorMessages } from "../common/messages.js";
import Token from "../models/Token.js";
import sendEmail from "../lib/sendEmail.js";

const registerUser = async (req: Request, res: Response) => {
  const parsedData = registerSchema.parse(req.body);
  const { email, password } = parsedData;

  try {
    // check if the user already exists
    const isAvailable = await User.findOne({ email });
    if (isAvailable)
      return res.status(409).json({
        status: "error",
        message: ErrorMessages.USER_ALREADY_EXISTS,
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const newUser = await User.create({
      ...parsedData,
      password: hashedPassword,
    });

    if (newUser) {
      const token = generateToken(newUser._id, newUser.is_admin);

      const userResponse = { ...newUser.toObject(), password: undefined };

      res.status(201).json({
        status: "success",
        message: SuccessMessages.USER_REGISTERED_SUCCESSFULLY,
        data: {
          token,
          user: userResponse,
        },
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: "error",
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

    const token = generateToken(user._id, user.is_admin);

    const userWithoutPassword = { ...user.toObject(), password: undefined };

    res.status(200).json({
      status: "success",
      message: SuccessMessages.USER_PROFILE_RETRIEVED,
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

// reset password
const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = requestPasswordResetSchema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    await Token.deleteOne({ userId: user._id });

    // Create new token
    const resetToken = crypto.randomBytes(32).toString("hex");
    await new Token({
      userId: user._id,
      token: resetToken,
    }).save();

    // In a real app, you would email this link
    const resetLink = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`;
    console.log("Password Reset Link:", resetLink);

    // Email content
    const subject = "Password Reset Request";
    const html = `<p>Hi ${user.first_name || "User"},</p>
                  <p>Your reset password link is here, Please click the link below to set a new password:</p>
                  <a href="${resetLink}">Reset Password</a>
               `;

    // Send the email
    await sendEmail(user.email, subject, html);

    res.status(200).json({
      status: "success",
      message: SuccessMessages.PASSWORD_RESET_LINK_SENT,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

// New controller for resetting the password
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = resetPasswordSchema.parse(req.body);
    const { token } = req.params;

    const resetToken = await Token.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({
        status: "error",
        message: ErrorMessages.INVALID_CREDENTIALS,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.updateOne(
      { _id: resetToken.userId },
      { $set: { password: hashedPassword } }
    );

    await Token.deleteOne({ _id: resetToken._id });

    res.status(200).json({
      status: "success",
      message: SuccessMessages.PASSWORD_RESET,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

export { registerUser, loginUser, requestPasswordReset, resetPassword };
