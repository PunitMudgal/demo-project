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
  if (req.body.address && typeof req.body.address === "string") {
    try {
      req.body.address = JSON.parse(req.body.address);
    } catch (error) {
      return handleApiError(
        req,
        res,
        "Invalid JSON in address field",
        ErrorMessages.VALIDATION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }
  }

  if (req.body.is_admin && typeof req.body.is_admin === "string") {
    req.body.is_admin = req.body.is_admin === "true";
  }

  const parsedData = registerSchema.safeParse(req.body);

  if (!parsedData.success) {
    return handleApiError(
      req,
      res,
      parsedData.error,
      ErrorMessages.VALIDATION_FAILED,
      StatusCodes.BAD_REQUEST
    );
  }

  const { email, password } = parsedData.data;

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
      ...parsedData.data,
      password: hashedPassword,
      is_active: parsedData.data.is_admin,
      profile_photo: req.file ? req.file.path : "",
    });

    if (newUser) {
      const token = generateToken(newUser._id, newUser.is_admin);

      const userResponse = { ...newUser.toObject(), password: undefined };

      res.header("Authorization", `Bearer ${token}`);
      handleApiSuccess(
        req,
        res,
        { user: userResponse },
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

    if (!parsedData.success) {
      return handleApiError(
        req,
        res,
        parsedData.error,
        ErrorMessages.VALIDATION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    const { email, password } = parsedData.data;
    const user = await User.findOne({ email, is_active: true });

    if (!user) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.INVALID_CREDENTIALS_OR_INCTIVE_ID,
        StatusCodes.UNAUTHORIZED
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
    const sendableData = {
      _id: userWithoutPassword._id,
      first_name: userWithoutPassword.first_name,
      email: userWithoutPassword.email,
      is_admin: userWithoutPassword.is_admin,
    };

    res.header("Authorization", `Bearer ${token}`);
    handleApiSuccess(
      req,
      res,
      { user: sendableData },
      SuccessMessages.USER_SIGNIN_SUCCESSFUL,
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
    const parsedData = requestPasswordResetSchema.safeParse(req.body);

    if (!parsedData.success) {
      return handleApiError(
        req,
        res,
        parsedData.error,
        ErrorMessages.VALIDATION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    const { email } = parsedData.data;
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
    await Token.deleteOne({ user_id: user._id });

    const resetToken = crypto.randomBytes(32).toString("hex");
    await new Token({
      user_id: user._id,
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
    const parsedData = resetPasswordSchema.safeParse(req.body);

    if (!parsedData.success) {
      return handleApiError(
        req,
        res,
        parsedData.error,
        ErrorMessages.VALIDATION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    const { password } = parsedData.data;
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
      { _id: resetToken.user_id },
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
