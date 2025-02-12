import {
  deleteOtpById,
  getOneOtp,
  getOtp,
  saveOtp,
} from "../service/otp.service.js";
import { sendMail } from "../helper/sendMail.js";
import { generateOTP } from "../helper/generateOTP.js";

export const sendOTP = async (req, res) => {
  try {
    if (req.authUser.userType != "ADMIN") {
      console.log("someone tries to call auth apis");
      return res
        .status(403)
        .json({ msg: "You are not allowed to use this API" });
    }
    const existingOTP = await getOtp({ user: req.authUser._id });
    if (existingOTP.length > 0) {
      for await (const otp of existingOTP) {
        await deleteOtpById(otp._id);
      }
    }
    const payloadValue = req.payloadValue;
    const otp = generateOTP();
    await saveOtp({ otp, user: payloadValue.userId });
    // await sendMail({ otp, mail: req.authUser.email });

    return res
      .status(200)
      .json({ msg: "OTP send successfully. Please check your mail", otp });
  } catch (error) {
    console.log("error", "error in sending OTP", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const time = Math.round(Date.now() / 1000);
    if (req.authUser.userType != "ADMIN") {
      console.log("someone tries to call auth apis");
      return res
        .status(403)
        .json({ msg: "You are not allowed to use this API" });
    }
    const payloadValue = req.payloadValue;
    const otp = await getOneOtp({
      otp: payloadValue.otp,
      user: payloadValue.userId,
    });
    if (time - new Date(otp.time).getTime() / 1000 > 60) {
      console.log("OTP Expired");
      return res.status(403).json({ msg: "OTP Expired" });
    }
    if (!otp) {
      console.log("invalid OTP");
      return res.status(422).json({ msg: "Invalid OTP" });
    }
    await deleteOtpById(otp._id);
    return res.status(200).json({ msg: "OTP Verified" });
  } catch (error) {
    console.log("error", "error in verify OTP", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};
