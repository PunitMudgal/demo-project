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
import { StatusCodes } from "http-status-codes";
import { handleApiSuccess, handleApiError } from "../common/returnResponse.js";

// register user
const registerUser = async (req: Request, res: Response) => {
  const parsedData = registerSchema.safeParse(req.body);
  const { email, password } = parsedData;

  try {
    // check if the user already exists
    const isAvailable = await User.findOne({ email });
    if (isAvailable)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.USER_ALREADY_EXISTS,
        StatusCodes.CONFLICT
      );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const newUser = await User.create({
      ...parsedData,
      password: hashedPassword,
      profile_photo: req.file ? req.file.path : "",
    });

    if (newUser) {
      const token = generateToken(newUser._id, newUser.is_admin);

      const userResponse = { ...newUser.toObject(), password: undefined };

      handleApiSuccess(
        req,
        res,
        { token, user: userResponse },
        SuccessMessages.USER_REGISTERED_SUCCESSFULLY,
        StatusCodes.OK
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    handleApiError(
      req,
      res,
      error,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// login user
const loginUser = async (req: Request, res: Response) => {
  try {
    const parsedData = loginSchema.safeParse(req.body);
    const { email, password } = parsedData;
    const user = await User.findOne({ email });

    if (!user) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.INVALID_CREDENTIALS,
        StatusCodes.UNAUTHORIZED
      );

    const token = generateToken(user._id, user.is_admin);

    const userWithoutPassword = { ...user.toObject(), password: undefined };

    handleApiSuccess(
      req,
      res,
      { token, user: userWithoutPassword },
      SuccessMessages.USER_PROFILE_RETRIEVED,
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Login error:", error);
    handleApiError(
      req,
      res,
      error,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// reset password
const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = requestPasswordResetSchema.safeParse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );
    }
    await Token.deleteOne({ userId: user._id });

    const resetToken = crypto.randomBytes(32).toString("hex");
    await new Token({
      userId: user._id,
      token: resetToken,
    }).save();

    const resetLink = `http://localhost:${process.env.PORT}/api/auth/reset-password/${resetToken}`;
    console.log("Password Reset Link:", resetLink);

    const subject = "Password Reset Request";
    const html = `<p>Hi ${user.first_name || "User"},</p>
                  <p>Your reset password link is here, Please click the link below to set a new password:</p>
                  <a href="${resetLink}">Reset Password</a>
               `;

    await sendEmail(user.email, subject, html);

    handleApiSuccess(
      req,
      res,
      null,
      SuccessMessages.PASSWORD_RESET_LINK_SENT,
      StatusCodes.OK
    );
  } catch (error) {
    handleApiError(
      req,
      res,
      error,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// for resetting the password
const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password } = resetPasswordSchema.safeParse(req.body);
    const { token } = req.params;

    const resetToken = await Token.findOne({ token });
    if (!resetToken) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.INVALID_CREDENTIALS,
        StatusCodes.BAD_REQUEST
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.updateOne(
      { _id: resetToken.userId },
      { $set: { password: hashedPassword } }
    );

    await Token.deleteOne({ _id: resetToken._id });

    handleApiSuccess(
      req,
      res,
      null,
      SuccessMessages.PASSWORD_RESET,
      StatusCodes.OK
    );
  } catch (error) {
    handleApiError(
      req,
      res,
      error,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export { registerUser, loginUser, requestPasswordReset, resetPassword };
