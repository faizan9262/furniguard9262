import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createToken } from "../utils/token-manager.js";
import {
  htmlContent,
  htmlLoginAlertContent,
  htmlRegisterContent,
} from "../utils/mailLayoutHtml.js";
import { sendMail } from "../utils/sendmail.js";
import { generateOtp } from "../utils/generateOtp.js";
import { Designer } from "../models/designer.model.js";
import { UserModel } from "../models/user.model.js";

dotenv.config();

export const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};

export const ADMIN_COOKIE_NAME = "admin_cookie";
export const USER_COOKIE_NAME = "auth_cookie";

export const setAuthCookie = (res, name, token) => {
  res.clearCookie(name, COOKIE_OPTIONS);
  res.cookie(name, token, COOKIE_OPTIONS);
};

export const clearAuthCookie = (res, name) => {
  res.clearCookie(name, { ...COOKIE_OPTIONS });
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All credentials are required!" });
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(409).json({ message: "User already exists." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const symbolRegex = /[!@#$%&]/;

    if (!uppercaseRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter",
      });
    }
    if (!numberRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must contain at least one number" });
    }
    if (!symbolRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one special character (!@#$%&)",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new UserModel({
      username: name,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    if (role === "designer") {
      const designer = new Designer({ user: user._id });
      await designer.save();
      user.designerProfile = designer._id;
      await user.save();
    }

    const token = createToken(user._id.toString(), email, "7d");

    res.clearCookie(USER_COOKIE_NAME, COOKIE_OPTIONS);
    res.cookie(USER_COOKIE_NAME, token, COOKIE_OPTIONS);

    await sendMail(
      user.email,
      "Thank you for Registering with Fruniguard!",
      htmlRegisterContent()
    );

    const populatedUser = await UserModel.findById(user._id)
      .populate("designerProfile")
      .select("-password");

    return res.status(201).json({
      message: "User registered successfully",
      id: populatedUser._id,
      name: populatedUser.username,
      email: populatedUser.email,
      profilePic: populatedUser.profilePicture,
      role: populatedUser.role,
      designerProfile: populatedUser.designerProfile || null,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong during signup." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT using user's role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Choose cookie name based on role
    const cookieName =
      user.role === "admin" ? ADMIN_COOKIE_NAME : USER_COOKIE_NAME;
    setAuthCookie(res, cookieName, token);

    return res.json({
      success: true,
      message: `${user.role} logged in successfully`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const logout = (req, res) => {
  try {
    const jwtData = res.locals.jwtData;
    if (!jwtData) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const cookieName = jwtData.role === "admin" ? ADMIN_COOKIE_NAME : USER_COOKIE_NAME;
    clearAuthCookie(res, cookieName);

    return res.json({
      success: true,
      message: `${jwtData.role} logged out successfully`,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const verifyUser = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not exist or Token Malfunctioned" });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      message: "OK",
      name: user.username,
      email: user.email,
      profilePic: user.profilePicture,
      emailVerified: user.emailVerified,
      role: user.role,
      id: user._id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while authorization" });
  }
};

export const sendVerifyEmailOtp = async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not exist or Token Malfunctioned" });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const otp = generateOtp();
    user.emailVerficationOtp = otp;
    user.emailVerficationOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const mailSubject = "Email Verification Otp.";
    const mailHtml = htmlContent(otp);

    await sendMail(user.email, mailSubject, mailHtml);

    return res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while sending email verification OTP",
    });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await UserModel.findById(res.locals.jwtData.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not exist or Token Malfunctioned" });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.emailVerficationOtp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (user.emailVerficationOtpExpiresAt < new Date()) {
      return res.status(401).json({ message: "OTP Expired" });
    }

    user.emailVerficationOtp = "";
    user.emailVerficationOtpExpiresAt = 0;
    user.emailVerified = true;
    await user.save();

    return res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while email verification",
    });
  }
};

export const sendPassswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not exist or Token Malfunctioned" });
    }

    const otp = generateOtp();
    user.passwordResetOtp = otp;
    user.passwordResetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const mailSubject = "Password Reset Otp.";
    const mailHtml = htmlContent(otp);

    await sendMail(user.email, mailSubject, mailHtml);

    return res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while sending password reset OTP",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist or token malfunctioned" });
    }

    if (user.passwordResetOtp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (user.passwordResetOtpExpiresAt < new Date()) {
      return res.status(401).json({ message: "OTP expired" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password length should be more than 6 characters" });
    }

    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const symbolRegex = /[!@#$%&]/;

    if (!uppercaseRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!numberRegex.test(newPassword)) {
      return res
        .status(400)
        .json({ message: "Password must contain at least one number" });
    }

    if (!symbolRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one special character (!@#$%&)",
      });
    }

    const newHashedPassword = await bcryptjs.hash(newPassword, 10);

    user.passwordResetOtp = "";
    user.passwordResetOtpExpiresAt = 0;
    user.password = newHashedPassword;
    await user.save();

    return res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while resetting password" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist or token malfunctioned" });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isMatchedPassword = await bcryptjs.compare(
      oldPassword,
      user.password
    );

    if (!isMatchedPassword) {
      if (!isPasswordMatched) {
        return res.status(403).json({ message: "Invalid Previous Password!" });
      }
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password length should be more than 6 characters" });
    }

    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const symbolRegex = /[!@#$%&]/;

    if (!uppercaseRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter",
      });
    }

    if (!numberRegex.test(newPassword)) {
      return res
        .status(400)
        .json({ message: "Password must contain at least one number" });
    }

    if (!symbolRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one special character (!@#$%&)",
      });
    }

    const newHashedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = newHashedPassword;
    await user.save();

    return res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while updating password" });
  }
};

export const changeProfilePic = async (req, res) => {
  try {
    // console.log("Request file:", req.file.path);
    const user = await UserModel.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist or token malfunctioned" });
    }

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = user._id;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // console.log("File received:", req.file);

    const imageUrl = req.file.path;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    console.error("Error changing profile picture:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
