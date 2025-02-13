import jwt from "jsonwebtoken";
import { getUserById } from "../service/user.service.js";

export const validateAuthIdToken = async (req, res, next) => {
  // const token = req.header("Authorization")?.replace("Bearer ", "");

  // if (!token) {
  //   res.status(403).json({ message: "Unauthorized request." });
  //   return;
  // }

  // const decode = jwt.verify(
  //   token,
  //   process.env.JWT_SECRET,
  //   function (err, decoded) {
  //     if (err) {
  //       console.log(err);
  //       return err;
  //     }
  //     return decoded;
  //   }
  // );

  // let userId = decode.id;
  let userId = req.session.userId;
  if (!userId) {
    res.status(403).json({ message: "Unauthorized request." });
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.status(403).json({ message: "Unauthorized request." });
    return;
  }

  req.authUser = user;
  next();
  return;
};

export const validateIsAdmin = async (req, res, next) => {
  const user = req.authUser;
  if (!user) {
    res.status(403).json({ message: "Unauthorized request." });
    return;
  }
  if (user.userType != "ADMIN") {
    console.log("SOmeone tries to access admin apis", {
      name: user.name,
      email: user.email,
    });

    res.status(403).json({ message: "Unauthorized request." });
    return;
  }
  next();
  return;
};
