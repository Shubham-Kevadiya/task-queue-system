import express from "express";
import {
  generateOTPValidation,
  verifyOTPValidation,
} from "../middleware/body.validate.js";
import { sendOTP, verifyOTP } from "../controller/otp.controller.js";
import { validateAuthIdToken } from "../middleware/authenticateUser.js";
const otpRoute = express.Router();

otpRoute.post("/send", validateAuthIdToken, generateOTPValidation, sendOTP);
otpRoute.post("/verify", validateAuthIdToken, verifyOTPValidation, verifyOTP);

export default otpRoute;
