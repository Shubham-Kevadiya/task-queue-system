import express from "express";
import {
  Is2FASetUp,
  login,
  makeAdmin,
  register,
  setUp2FAByApp,
  verify2FAByApp,
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
  "/setUp2FAByApp",
  validateAuthIdToken,
  validateIsAdmin,
  sendOTPOfGAValidation,
  setUp2FAByApp
);
userRoute.get("/Is2FASetUp", validateAuthIdToken, validateIsAdmin, Is2FASetUp);
userRoute.post(
  "/verify2FAByApp",
  validateAuthIdToken,
  validateIsAdmin,
  verifyOTPOfGAValidation,
  verify2FAByApp
);
// userRoute.post("/verifyRefreshToken", verifyRefreshToken);
userRoute.post(
  "/makeAdmin/:userId",
  validateAuthIdToken,
  validateIsAdmin,
  makeAdmin
);

export default userRoute;
