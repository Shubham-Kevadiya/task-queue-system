import { userModel } from "../model/user.model.js";

export const saveUser = async (userData) => {
  const user = await new userModel(userData).save();
  return user;
};
export const getUser = async () => {
  const user = await userModel.find();
  return user;
};
export const getOneUser = async (query) => {
  const user = await userModel.findOne(query);
  return user;
};
export const getUserById = async (userId) => {
  const user = await userModel.findById(userId).lean();
  return user;
};
export const updateUserById = async (userData) => {
  const user = await userModel.findByIdAndUpdate(userData._id, { ...userData });
  return user;
};
export const deleteUserById = async (userId) => {
  await userModel.findByIdAndDelete(userId);
  return "user deleted successsfully !";
};
