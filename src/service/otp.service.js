import { otpModel } from "../model/otp.model.js";

export const saveOtp = async (otpData) => {
  const otp = await new otpModel(otpData).save();
  return otp;
};
export const getOneOtp = async (query) => {
  const otp = await otpModel.findOne(query);
  return otp;
};
export const getOtp = async (query) => {
  const otp = await otpModel.find(query);
  return otp;
};
export const getOtpById = async (otpId) => {
  const otp = await otpModel.findById(otpId);
  return otp;
};
export const deleteOtpById = async (otpId) => {
  await otpModel.findByIdAndDelete(otpId);
  return "otp deleted successsfully !";
};
