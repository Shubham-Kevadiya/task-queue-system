import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    time: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

export const otpModel = new mongoose.model("otp", otpSchema);
