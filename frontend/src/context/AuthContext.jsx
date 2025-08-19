import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import {
  authStatus,
  loginUser,
  logoutUser,
  sendPasswordResetMail,
  sendVerifyEmailOtp,
  signupUser,
  verifyEmailOtp,
  resetPassword,
  updatePassword,
  updateProfile,
} from "../helper/api-communicator.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [passwordOtpSent, setPasswordOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const data = await authStatus();
      // console.log("User Data:",data);
      if (data) {
        setUser({
          email: data.email,
          name: data.name,
          profilePic: data.profilePic,
          isEmailVerified: data.emailVerified,
          role: data.role,
          id: data.id,
        });
        setLoading(false);
        setIsLoggedIn(true);
      } else {
        setLoading(true);
        setUser({
          email: "",
          name: "",
          profilePic: "",
          isEmailVerified: "",
        });
        setLoading(false);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);


  const login = async (email, password) => {
    const data = await loginUser(email, password);
    // console.log("After Login :",data);

    if (data) {
      setUser({
        email: data.email,
        name: data.name,
        profilePicture: data.profilePic,
        role: data.role,
      });
      setIsLoggedIn(true);
    }
  };

  const signup = async (name, email, password) => {
    const data = await signupUser(name, email, password);
    if (data) {
      setIsEmailVerified(false);
      setUser({
        email: data.email,
        name: data.name,
        profilePic: user.profilePic,
      });
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    const data = await logoutUser();
    if (data) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const sendEmailVerifyOtp = async () => {
    const data = await sendVerifyEmailOtp();
    if (data) {
      setOtpSent(true);
    }
  };
  const verifyOtpForEmail = async (otp) => {
    const data = await verifyEmailOtp(otp);
    if (data) {
    }
  };

  const sendOtpForPasswordReset = async (email) => {
    const data = await sendPasswordResetMail(email);
    if (data) {
      // console.log("Password Reset Email Sent.");
      setPasswordOtpSent(true);
    }
  };

  const resetYourPassword = async (otp, newPassword, email) => {
    const data = await resetPassword(otp, newPassword, email);
    if (data) {
      // console.log("Password Reset Successfully");
    }
  };

  const updateYourPassword = async (oldPassword, newPassword) => {
    const data = await updatePassword(oldPassword, newPassword);
    if (data) {
      // console.log("Password Updated Successfully");
    }
  };

  const updateProfilePic = async (formData) => {
    const data = await updateProfile(formData);
    // console.log("User",data);
    if (data) {
      setUser((prevUser) => ({
        ...prevUser,
        profilePic: data.profilePicture,
      }));
    }
  };

  const value = {
    user,
    setUser,
    login,
    isLoggedIn,
    setIsLoggedIn,
    signup,
    logout,
    otpSent,
    otp,
    setOtp,
    sendEmailVerifyOtp,
    verifyOtpForEmail,
    sendOtpForPasswordReset,
    resetYourPassword,
    passwordOtpSent,
    updateYourPassword,
    email,
    setEmail,
    updateProfilePic,
    wishlistCount,
    setWishlistCount,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
