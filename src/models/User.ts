import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    requried: true,
    min: 3,
    max: 40,
  },
  lastName: {
    type: String,
    min: 3,
    max: 40,
  },
  email: {
    type: String,
    requried: true,
    min: 5,
    max: 60,
  },
  passsword: {
    type: String,
    requried: true,
    min: 3,
    max: 60,
  },
  about: {
    type: String,
    requried: true,
    min: 10,
    max: 500,
  },
  address: {
    streetName: { type: String, max: 100 },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  isAdmin: {
    type: Boolean,
    default: false,
    min: 10,
    max: 500,
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
  educationQualificaiton: {
    type: String,
    required: true,
    default: "N/A",
  },
});
