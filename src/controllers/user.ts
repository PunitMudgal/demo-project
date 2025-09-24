import type { Request, Response } from "express";
import User from "../models/User.js";
import { ErrorMessages, Status, SuccessMessages } from "../common/messages.js";
import mongoose from "mongoose";
import { updateUserSchema } from "../schema/userSchema.js";
import { StatusCodes } from "http-status-codes";
import {
  handleApiSuccess,
  handleApiError,
  handleApiValidation,
} from "../common/returnResponse.js";

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.ID_REQUIRED,
        StatusCodes.NOT_FOUND
      );
    }
    const user = await User.findById(userId).select("-password");
    if (!user)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );

    handleApiSuccess(
      req,
      res,
      user,
      SuccessMessages.USER_PROFILE_RETRIEVED,
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

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, isAdmin: isUserAdmin } = req;

    if (!userId)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.ID_REQUIRED,
        StatusCodes.NOT_FOUND
      );

    if (userId.toString() !== id && !isUserAdmin) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.PERMISSION_NOT_FOUND,
        StatusCodes.UNAUTHORIZED
      );
    }

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

    const validationResult = updateUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      return handleApiValidation(
        req,
        res,
        validationResult.error,
        ErrorMessages.VALIDATION_FAILED,
        StatusCodes.BAD_REQUEST
      );
    }

    const validatedData = {
      ...validationResult.data,
      profile_photo: req.file ? req.file.path : undefined,
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: validatedData,
      },
      {
        new: true,
        runValidators: true,
        select: "-password",
      }
    );

    if (!updatedUser) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );
    }

    handleApiSuccess(
      req,
      res,
      updatedUser,
      SuccessMessages.USER_UPDATED,
      StatusCodes.OK
    );
  } catch (error) {
    console.error("Update user error:", error);

    handleApiError(
      req,
      res,
      null,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, isAdmin } = req;

  if (!id || !userId)
    return handleApiError(
      req,
      res,
      null,
      ErrorMessages.ID_REQUIRED,
      StatusCodes.NOT_FOUND
    );

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.INVALID_USERID,
        StatusCodes.BAD_REQUEST
      );
    }

    if (userId.toString() !== id && !isAdmin) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.PERMISSION_NOT_FOUND,
        StatusCodes.UNAUTHORIZED
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );
    }

    handleApiSuccess(
      req,
      res,
      null,
      SuccessMessages.USER_DELETED,
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

export { getUser, updateUser, deleteUser };
