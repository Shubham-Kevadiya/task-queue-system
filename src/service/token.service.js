import { tokenModel } from "../model/token.model.js";

export const saveToken = async (tokenData) => {
  const token = await new tokenModel(tokenData).save();
  return token;
};
export const getOneToken = async (query) => {
  const token = await tokenModel.findOne(query);
  return token;
};
export const getTokenById = async (tokenId) => {
  const token = await tokenModel.findById(tokenId);
  return token;
};
export const deleteTokenById = async (tokenId) => {
  await tokenModel.findByIdAndDelete(tokenId);
  return "token deleted successsfully !";
};
