import express from "express";
import {
  login,
  makeAdmin,
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
import {
  validateAuthIdToken,
  validateIsAdmin,
} from "../middleware/authenticateUser.js";
const userRoute = express.Router();

userRoute.post("/register", registerValidation, register);
userRoute.post("/login", loginValidation, login);
userRoute.post(
  "/sendOTPByGA",
  validateAuthIdToken,
  validateIsAdmin,
  sendOTPOfGAValidation,
  sendOTPByGA
);
userRoute.post(
  "/verifyOTPOfGA",
  validateAuthIdToken,
  validateIsAdmin,
  verifyOTPOfGAValidation,
  verifyOTPOfGA
);
userRoute.post("/verifyRefreshToken", verifyRefreshToken);
userRoute.post(
  "/makeAdmin/:userId",
  validateAuthIdToken,
  validateIsAdmin,
  makeAdmin
);

export default userRoute;
