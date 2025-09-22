import type { Request, Response } from "express";
import User from "../models/User.js";
import { ErrorMessages, SuccessMessages } from "../common/messages.js";
import mongoose from "mongoose";
import { updateUserSchema } from "../schema/userSchema.js";

const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    if (!userId) {
      return res.status(404).json({
        status: "error",
        message: ErrorMessages.ID_REQUIRED,
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({
        status: "error",
        message: ErrorMessages.USER_NOT_FOUND,
      });

    res.status(200).json({
      status: "success",
      message: SuccessMessages.USER_PROFILE_RETRIEVED,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
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
      return res
        .status(404)
        .json({ status: "error", message: ErrorMessages.ID_REQUIRED });

    if (userId.toString() !== id && !isUserAdmin) {
      return res.status(401).json({
        status: "error",
        message: ErrorMessages.PERMISSION_NOT_FOUND,
      });
    }

    const validationResult = updateUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        status: "error",
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
      return res.status(404).json({
        status: "error",
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    res.status(200).json({
      status: "success",
      message: SuccessMessages.USER_UPDATED,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, isAdmin } = req;

  if (!id || !userId)
    return res
      .status(404)
      .json({ status: "error", message: ErrorMessages.ID_REQUIRED });

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "error",
        message: ErrorMessages.INVALID_USERID,
      });
    }

    if (userId.toString() !== id && !isAdmin) {
      return res.status(403).json({
        // ✅ Use 403 instead of 401
        status: "error",
        message: ErrorMessages.PERMISSION_NOT_FOUND,
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }

    res.status(200).json({
      status: "success",
      message: SuccessMessages.USER_DELETED,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

export { getUser, updateUser, deleteUser };
