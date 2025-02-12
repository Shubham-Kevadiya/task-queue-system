import express from "express";
import {
  login,
  register,
  sendOTPByGA,
  verifyOTPOfGA,
  verifyRefreshToken,
} from "../controller/user.controller.js";
import {
  loginValidation,
  registerValidation,
  sendOTPOfGAValidation,
  verifyOTPOfGAValidation,
} from "../middleware/body.validate.js";
import { validateAuthIdToken } from "../middleware/authenticateUser.js";
const userRoute = express.Router();

userRoute.post("/register", registerValidation, register);
userRoute.post("/login", loginValidation, login);
userRoute.post(
  "/sendOTPByGA",
  validateAuthIdToken,
  sendOTPOfGAValidation,
  sendOTPByGA
);
userRoute.post(
  "/verifyOTPOfGA",
  validateAuthIdToken,
  verifyOTPOfGAValidation,
  verifyOTPOfGA
);
userRoute.post("/verifyRefreshToken", verifyRefreshToken);

export default userRoute;
