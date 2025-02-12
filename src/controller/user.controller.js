import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { userModel } from "../model/user.model.js";
import { getOneUser, getUserById, saveUser } from "../service/user.service.js";
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
    const token = jwt.sign(
      { id: user._id?.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user._id?.toString() },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await saveToken({
      token: refreshToken,
      type: "Refresh Token",
      user: user.id,
    });
    return res
      .status(200)
      .cookie("auth", refreshToken)
      .set({ "x-auth-token": token })
      .json({
        name: payloadValue.name,
        email: payloadValue.email,
        age: payloadValue.age,
      });
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

    const token = jwt.sign(
      { id: user._id?.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: user._id?.toString() },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const existingTokenOfUser = await getOneToken({
      type: "Refresh Token",
      user: user._id,
    });
    if (existingTokenOfUser) {
      await deleteTokenById(existingTokenOfUser._id);
    }
    await saveToken({
      token: refreshToken,
      type: "Refresh Token",
      user: user.id,
    });
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
      return res
        .status(200)
        .cookie("auth", refreshToken)
        .set({ "x-auth-token": token })
        .json({
          redirect: "http://localhost:5001/2fa",
          tokenToVerify,
          userId: user._id,
        });
    } else {
      return res
        .status(200)
        .cookie("auth", refreshToken)
        .set({ "x-auth-token": token })
        .json({ redirect: "http://localhost:5001/home", user });
    }
  } catch (error) {
    console.log("error", "error in register", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error: _get(error, "message"),
    });
  }
};

export const verifyRefreshToken = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    return res.status(401).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.log(err);
          return res
            .status(403)
            .json({ error: "Forbidden: Refresh token expired!" });
        }
        req.user = decoded.username;
      }
    );
    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const user = await getUserById(decoded.user);
    return res.status(200).set({ "x-auth-token": accessToken }).json({ user });
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};

export const sendOTPByGA = async (req, res) => {
  try {
    if (req.authUser.userType != "ADMIN") {
      console.log("someone tries to call auth apis");
      return res
        .status(403)
        .json({ msg: "You are not allowed to use this API" });
    }
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
    await deleteTokenById(token._id);
    // Generate a secret key
    const secret = speakeasy.generateSecret({ length: 20 });

    // Function to generate a QR code URL for Google Authenticator

    const qrcodeURL = await QRCode.toDataURL(secret.otpauth_url);
    return res.status(200).json({ qrImage: qrcodeURL, token: secret.base32 });
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};

export const verifyOTPOfGA = async (req, res) => {
  try {
    if (req.authUser.userType != "ADMIN") {
      console.log("someone tries to call auth apis");
      return res
        .status(403)
        .json({ msg: "You are not allowed to use this API" });
    }
    const payloadValue = req.payloadValue;
    const verified = speakeasy.totp.verify({
      secret: payloadValue.token,
      encoding: "base32",
      token: otp,
    });

    if (verified) {
      return res.status(200).json({ msg: "OTP Verified" });
    } else {
      return res.status(422).json({ msg: "Invalid OTP" });
    }
  } catch (error) {
    return res.status(400).send("Invalid refresh token.");
  }
};
