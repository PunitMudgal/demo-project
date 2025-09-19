import mongoose from "mongoose";
import type { required } from "zod/mini";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      min: 5,
      max: 40,
    },
    password: {
      type: String,
      required: true,
      min: 3,
      max: 60,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      required: true,
      min: 10,
      max: 500,
    },
    address: {
      streetName: { type: String, max: 100 },
      pincode: { type: Number },
      state: { type: String },
      country: { type: String },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    educationQualification: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
