import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { userModel } from "../model/user.model.js";
import {
  getOneUser,
  getUserById,
  saveUser,
  updateUserById,
} from "../service/user.service.js";
import {
  deleteTokenById,
  getOneToken,
  saveToken,
} from "../service/token.service.js";

export const register = async (req, res) => {
  try {
    const payloadValue = req.payloadValue;
    let user;
    user = await getOneUser({ email: payloadValue.email });
    if (user) {
      console.log("User already exist with same email");
      return res
        .status(409)
        .json({ message: "User already exist with same email" });
    }
    user = await saveUser(
      new userModel({
        ...payloadValue,
        password: CryptoJS.AES.encrypt(
          payloadValue.password,
          process.env.AES_KEY
        ).toString(),
      })
    );
    // const token = jwt.sign(
    //   { id: user._id?.toString() },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );
    // const refreshToken = jwt.sign(
    //   { id: user._id?.toString() },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "1d" }
    // );
    // await saveToken({
    //   token: refreshToken,
    //   type: "Refresh Token",
    //   user: user.id,
    // });
    req.session.userId = user._id;

    return (
      res
        .status(200)
        // .cookie("auth", refreshToken)
        // .set({ "x-auth-token": token })
        .json({
          name: payloadValue.name,
          email: payloadValue.email,
          age: payloadValue.age,
        })
    );
  } catch (error) {
    console.log("error", "error in register", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const payloadValue = req.payloadValue;

    const user = await getOneUser({ email: payloadValue.email });
    if (!user) {
      console.log("User not exist with this email");
      return res
        .status(403)
        .json({ message: "User not exist with this email" });
    }

    const password = CryptoJS.AES.decrypt(
      user.password,
      process.env.AES_KEY
    ).toString(CryptoJS.enc.Utf8);
    if (password != payloadValue.password) {
      console.log("invalid password");
      return res.status(422).json({ message: "Invalid Password" });
    }

    // const token = jwt.sign(
    //   { id: user._id?.toString() },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1h" }
    // );
    // const refreshToken = jwt.sign(
    //   { id: user._id?.toString() },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "1d" }
    // );
    // const existingTokenOfUser = await getOneToken({
    //   type: "Refresh Token",
    //   user: user._id,
    // });
    // if (existingTokenOfUser) {
    //   await deleteTokenById(existingTokenOfUser._id);
    // }
    // await saveToken({
    //   token: refreshToken,
    //   type: "Refresh Token",
    //   user: user.id,
    // });
    req.session.userId = user._id;
    delete user.password;
    delete user.authSecret;

    if (user.userType == "ADMIN") {
      const existingTokenOfUser = await getOneToken({
        type: "Verify for Auth",
        user: user._id,
      });
      if (existingTokenOfUser) {
        await deleteTokenById(existingTokenOfUser._id);
      }
      const tokenToVerify = uuidv4();
      await saveToken({
        token: tokenToVerify,
        type: "Verify for Auth",
        user: user._id,
      });
      return (
        res
          .status(200)
          // .cookie("auth", refreshToken)
          // .set({ "x-auth-token": token })
          .json({
            redirect: "http://localhost:5001/2fa",
            tokenToVerify,
            userId: user._id,
          })
      );
    } else {
      return (
        res
          .status(200)
          // .cookie("auth", refreshToken)
          // .set({ "x-auth-token": token })
          .json({ redirect: "http://localhost:5001/home", user })
      );
    }
  } catch (error) {
    console.log("error", "error in register", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error: _get(error, "message"),
    });
  }
};

// export const verifyRefreshToken = async (req, res) => {
//   const refreshToken = req.cookies["refreshToken"];
//   if (!refreshToken) {
//     return res.status(401).send("Access Denied. No refresh token provided.");
//   }

//   try {
//     const decoded = jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       (err, decoded) => {
//         if (err) {
//           console.log(err);
//           return res
//             .status(403)
//             .json({ error: "Forbidden: Refresh token expired!" });
//         }
//         req.user = decoded.username;
//       }
//     );
//     const accessToken = jwt.sign(
//       { user: decoded.user },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     const user = await getUserById(decoded.user);
//     return res.status(200).set({ "x-auth-token": accessToken }).json({ user });
//   } catch (error) {
//     return res.status(400).send("Invalid refresh token.");
//   }
// };

export const Is2FASetUp = async (req, res) => {
  try {
    const user = await getUserById(req.authUser._id);
    if (!user) {
      res.status(403).json({ Is2FASetUp: flag });
    }
    let flag = false;
    if (user.authSecret != "") {
      flag = true;
    }
    return res.status(200).json({ Is2FASetUp: flag });
  } catch (error) {
    console.log("Error from send OTP by GA", error);
    return res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
};

export const setUp2FAByApp = async (req, res) => {
  try {
    const payloadValue = req.payloadValue;
    const token = await getOneToken({
      token: payloadValue.token,
      user: payloadValue.userId,
      type: "Verify for Auth",
    });
    if (!token) {
      console.log("someone try to call apis for Two Factor Authentication", {
        payloadValue,
      });

      return res
        .status(403)
        .json({ msg: "You are not allowed for Two Factor Authentication" });
    }
    // Generate a secret key
    const secret = speakeasy.generateSecret({ length: 20 });

    // Function to generate a QR code URL for Google Authenticator

    const qrcodeURL = QRCode.toDataURL(secret.otpauth_url);
    // let base64Image = qrcodeURL.split(";base64,").pop();
    // fs.writeFile(
    //   "uploads/image.png",
    //   base64Image,
    //   { encoding: "base64" },
    //   function (err) {
    //     console.log("File created");
    //   }
    // );
    await deleteTokenById(token._id);
    await updateUserById({ ...req.authUser, authSecret: secret.base32 });
    // return res
    //   .status(200)
    //   .sendFile(
    //     "/Users/shubham/Desktop/shubham/javascript/task-queue-system/uploads/image.png"
    //   );
    return res.status(200).json({ qrImage: qrcodeURL });
  } catch (error) {
    console.log("Error from setUp 2FA By App", error);
    return res
      .status(500)
      .send({ msg: "Something went wrong, please try again later" });
  }
};

export const verify2FAByApp = async (req, res) => {
  try {
    const payloadValue = req.payloadValue;
    const verified = speakeasy.totp.verify({
      secret: payloadValue.token,
      encoding: "base32",
      token: payloadValue.otp,
    });

    if (verified) {
      return res.status(200).json({ msg: "OTP Verified" });
    } else {
      return res.status(422).json({ msg: "Invalid OTP" });
    }
  } catch (error) {
    console.log("Error from verify 2FA By App", error);
    return res.status(500).send("Something went wrong, please try again later");
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      res.status(422).json({ msg: "Please provide userId to make admin" });
    }
    const user = await getUserById(userId);
    if (!user) {
      res.status(422).json({ msg: "Invalid userId" });
    }
    await updateUserById({ id: user._id, ...user, userType: "ADMIN" });
    res.status(200).json({ msg: "User updated to admin successfully" });
  } catch (error) {
    console.log("Error from make admin", error);
    return res.status(500).send("Something went wrong, please try again later");
  }
};
