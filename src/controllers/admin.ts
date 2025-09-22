import type { Request, Response } from "express";
import User from "../models/User.js";
import { ErrorMessages, SuccessMessages } from "../common/messages.js";
import { StatusCodes } from "http-status-codes";

// search/get specific user
// /api/admin/:id
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      status_code: StatusCodes.BAD_REQUEST,
      message: ErrorMessages.UNAUTHORIZED,
    });
  try {
    if (!id)
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        status_code: StatusCodes.NOT_FOUND,
        message: ErrorMessages.ID_REQUIRED,
      });
    const user = await User.findById(id).select("-password");
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
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

// get all users
const getAllUsers = async (req: Request, res: Response) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "error",
      status_code: StatusCodes.UNAUTHORIZED,
      message: ErrorMessages.UNAUTHORIZED,
    });
  try {
    const allUsers = await User.find({}).select("-password").lean();
    if (!allUsers)
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        status_code: StatusCodes.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    res.status(StatusCodes.OK).json({
      status: "success",
      status_code: StatusCodes.OK,
      message: SuccessMessages.USERS_RETRIEVED,
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

const deleteAllUsers = async (req: Request, res: Response) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: "error",
      status_code: StatusCodes.UNAUTHORIZED,
      message: ErrorMessages.UNAUTHORIZED,
    });
  try {
    await User.deleteMany({ is_admin: { $ne: true } });
    res.status(StatusCodes.OK).json({
      status: "success",
      status_code: StatusCodes.OK,
      message: SuccessMessages.USER_DELETED,
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      status_code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      error,
    });
  }
};

export { getUser, getAllUsers, deleteAllUsers };
