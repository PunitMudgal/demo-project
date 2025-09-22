import type { Request, Response } from "express";
import User from "../models/User.js";
import { ErrorMessages, Status, SuccessMessages } from "../common/messages.js";
import mongoose from "mongoose";
import { updateUserSchema } from "../schema/userSchema.js";
import { StatusCodes } from "http-status-codes";

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        status_code: StatusCodes.NOT_FOUND,
        message: ErrorMessages.ID_REQUIRED,
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        status_code: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });

    res.status(StatusCodes.OK).json({
      status: "success",
      status_code: StatusCodes.OK,
      message: SuccessMessages.USER_PROFILE_RETRIEVED,
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, isAdmin: isUserAdmin } = req;

    if (!userId)
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        status_code: StatusCodes.NOT_FOUND,
        message: ErrorMessages.ID_REQUIRED,
      });

    if (userId.toString() !== id && !isUserAdmin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        status_code: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.PERMISSION_NOT_FOUND,
      });
    }

    const validationResult = updateUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        status_code: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.VALIDATION_FAILED,
        errors: validationResult.error,
      });
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
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        status_code: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      status_code: StatusCodes.OK,
      message: SuccessMessages.USER_UPDATED,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, isAdmin } = req;

  if (!id || !userId)
    return res.status(StatusCodes.NOT_FOUND).json({
      status: "error",
      status_code: StatusCodes.NOT_FOUND,
      message: ErrorMessages.ID_REQUIRED,
    });

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        status_code: StatusCodes.BAD_REQUEST,
        message: ErrorMessages.INVALID_USERID,
      });
    }

    if (userId.toString() !== id && !isAdmin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        status_code: StatusCodes.UNAUTHORIZED,
        message: ErrorMessages.PERMISSION_NOT_FOUND,
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        status_code: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      status_code: StatusCodes.OK,
      message: SuccessMessages.USER_DELETED,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

export { getUser, updateUser, deleteUser };
