import mongoose from "mongoose";
import type { required } from "zod/mini";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    last_name: {
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
    profile_photo: {
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
      street_name: { type: String, max: 100 },
      pincode: { type: Number },
      state: { type: String },
      country: { type: String },
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    education_qualification: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
