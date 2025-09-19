import type { Request, Response } from "express";
import User from "../models/User.js";

// search/get specific user
// /api/admin/:id
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res.status(401).json({ message: "You cannot perform this action" });
  try {
    if (!id) return res.status(404).json({ message: "User id not provided" });
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json({ message: "User found successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while finding the user: ", error });
  }
};

// get all users
const getAllUsers = async (req: Request, res: Response) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res.status(401).json({ message: "You cannot perform this action!" });

  try {
    const allUsers = await User.find({}).select("-password").lean();
    if (!allUsers)
      return res.status(404).json({ message: "Cannot get all users" });
    res.status(200).json({ message: "Users Found successfully", allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while finding the user: ", error });
  }
};

const deleteAllUsers = async (req: Request, res: Response) => {
  const isAdmin = req.isAdmin;
  if (!isAdmin)
    return res.status(404).json({ message: "You cannot perform this action" });
  try {
    await User.deleteMany({ isAdmin: { $ne: true } });
    res.status(200).json({ message: "All users deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while finding the user: ", error });
  }
};

export { getUser, getAllUsers, deleteAllUsers };
