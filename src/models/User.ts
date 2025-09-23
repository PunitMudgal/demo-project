import mongoose from "mongoose";
import type { required } from "zod/mini";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    last_name: {
      type: String,
      default: "",
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 40,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 60,
    },
    profile_photo: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      required: true,
      maxLength: 500,
      default: "",
    },
    address: {
      street_name: { type: String, maxLength: 100, default: "" },
      pincode: { type: Number, default: null },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
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
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
