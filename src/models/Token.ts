import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: 3600, // means 1hr
  },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
