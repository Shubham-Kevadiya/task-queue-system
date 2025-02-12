import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export const tokenModel = new mongoose.model("token", tokenSchema);
