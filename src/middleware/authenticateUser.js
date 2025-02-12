import jwt from "jsonwebtoken";
import { getUserById } from "../service/user.service.js";

export const validateAuthIdToken = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(403).json({ message: "Unauthorized request." });
    return;
  }

  const decode = jwt.verify(
    token,
    process.env.JWT_SECRET,
    function (err, decoded) {
      if (err) {
        console.log(err);
        return err;
      }
      return decoded;
    }
  );

  let userId = decode.id;
  if (!userId) {
    res.status(403).json({ message: "Unauthorized request." });
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.status(403).json({ message: "Unauthorized request." });
    return;
  }

  const userRawData = user.toJSON();
  req.authUser = userRawData;
  next();
  return;
};
