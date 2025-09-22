import type { Request, Response } from "express";
import User from "../models/User.js";
import { ErrorMessages, SuccessMessages } from "../common/messages.js";

// search/get specific user
// /api/admin/:id
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res
      .status(401)
      .json({ status: "error", message: ErrorMessages.UNAUTHORIZED });
  try {
    if (!id)
      return res.status(404).json({
        status: "error",
        message: ErrorMessages.ID_REQUIRED,
      });
    const user = await User.findById(id).select("-password");
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
    console.log(error);
    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

// get all users
const getAllUsers = async (req: Request, res: Response) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res.status(401).json({
      status: "error",
      message: ErrorMessages.UNAUTHORIZED,
    });
  try {
    const allUsers = await User.find({}).select("-password").lean();
    if (!allUsers)
      return res.status(404).json({
        status: "error",
        message: "No users found",
      });
    res.status(200).json({
      status: "success",
      message: SuccessMessages.USERS_RETRIEVED,
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

const deleteAllUsers = async (req: Request, res: Response) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res.status(401).json({
      status: "error",
      message: ErrorMessages.UNAUTHORIZED,
    });
  try {
    await User.deleteMany({ is_admin: { $ne: true } });
    res.status(200).json({
      status: "success",
      message: SuccessMessages.USER_DELETED,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

export { getUser, getAllUsers, deleteAllUsers };
