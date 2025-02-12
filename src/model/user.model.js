import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    userType: {
      type: String,
      default: "USER",
    },
  },
  { timestamps: true }
);

export const userModel = new mongoose.model("user", userSchema);
