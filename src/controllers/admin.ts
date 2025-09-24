import type { Request, Response } from "express";
import User from "../models/User.js";
import { ErrorMessages, SuccessMessages } from "../common/messages.js";
import { StatusCodes } from "http-status-codes";
import { handleApiSuccess, handleApiError } from "../common/returnResponse.js";

// search/get specific user
// /api/admin/:id
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const isAdmin = req.isAdmin;
  // if (!isAdmin)
  //   return handleApiError(
  //     req,
  //     res,
  //     null,
  //     ErrorMessages.UNAUTHORIZED,
  //     StatusCodes.BAD_REQUEST
  //   );

  try {
    if (!id)
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.ID_REQUIRED,
        StatusCodes.BAD_REQUEST
      );

    const user = await User.findById(id).select("-password");
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
    console.log(error);
    handleApiError(
      req,
      res,
      error,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// get all users
const getAllUsers = async (req: Request, res: Response) => {
  // const isAdmin = req.isAdmin;
  // if (!isAdmin)
  //   return handleApiError(
  //     req,
  //     res,
  //     null,
  //     ErrorMessages.UNAUTHORIZED,
  //     StatusCodes.UNAUTHORIZED
  //   );
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const allUsers = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments({});
    if (!allUsers)
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
      { users: allUsers, totalUsers },
      SuccessMessages.USERS_RETRIEVED,
      StatusCodes.OK
    );
  } catch (error) {
    console.log(error);
    handleApiError(
      req,
      res,
      error,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteAllUsers = async (req: Request, res: Response) => {
  // const isAdmin = req.isAdmin;
  // if (!isAdmin)
  //   return handleApiError(
  //     req,
  //     res,
  //     null,
  //     ErrorMessages.UNAUTHORIZED,
  //     StatusCodes.UNAUTHORIZED
  //   );
  try {
    await User.deleteMany({ is_admin: { $ne: true } });
    handleApiSuccess(
      req,
      res,
      null,
      SuccessMessages.USER_DELETED,
      StatusCodes.OK
    );
  } catch (error) {
    console.log(error);
    handleApiError(
      req,
      res,
      error,
      ErrorMessages.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const toggleUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return handleApiError(
        req,
        res,
        null,
        ErrorMessages.USER_NOT_FOUND,
        StatusCodes.NOT_FOUND
      );
    }
    user.is_active = !user.is_active;
    await user.save();

    const ResMessage = user.is_active
      ? SuccessMessages.USER_ACTIVATED
      : SuccessMessages.USER_DEACTIVATED;

    const data = {};

    handleApiSuccess(
      req,
      res,
      {
        first_name: user.first_name,
        email: user.email,
        is_active: user.is_active,
      },
      ResMessage,
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

export { getUser, getAllUsers, deleteAllUsers, toggleUserStatus };
