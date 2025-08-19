import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/components/ui/card";
import {
  FaCalendarAlt,
  FaEdit,
  FaEnvelope,
  FaHeart,
  FaKey,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Badge } from "@/components/components/ui/badge";
import { AiOutlineSchedule } from "react-icons/ai";
import { PiListHeart } from "react-icons/pi";
import { Button } from "@/components/components/ui/button";
import { useDesiner } from "../context/DesignerContex";
import { useAppointment } from "../context/AppointmentsContex";
import { toast } from "sonner";

const UserProfile = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const designer = useDesiner();
  const { user } = auth;
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  let pendingAppointment = 0;
  const appointment = useAppointment();
  const allAppointmentsOfUser = appointment?.allAppointments;

  allAppointmentsOfUser?.forEach((ap) => {
    if (ap.status !== "completed") {
      pendingAppointment += 1;
    }
  });

  const handleEditProfilePic = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    try {
      toast.loading("Updating Your Profile", { id: "update-profile" });
      const formData = new FormData();
      formData.append("profile", file);
      await auth.updateProfilePic(formData);
      toast.success("Profile Updated", { id: "update-profile" });
    } catch (error) {
      toast.error(error.message, { id: "update-profile" });
    }
  };

  const emailVerificationOtp = async () => {
    try {
      await auth.sendEmailVerifyOtp();
      toast.success("6 Digit OTP sent to your registered email.", { id: "otp" });
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.message, { id: "otp" });
    }
  };

  const handleLogout = () => {
    auth.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#faf6ef] to-[#ebdcc8] py-12 px-4 flex flex-col items-center justify-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center max-w-3xl"
      >
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome to Your Profile
        </h1>
        <p className="text-gray-700 text-base">
          Manage your personal details, appointments, saved items, and account
          settings all in one place.
        </p>
      </motion.div>

      {/* Main Cards */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col lg:flex-row gap-6 items-stretch justify-center w-full max-w-6xl"
      >
        {/* Profile Card */}
        <Card className="w-full border-2 border-secondary lg:w-[30%] rounded-3xl shadow-xl bg-secondary/20 backdrop-blur-md z-10">
          <CardHeader className="flex flex-col items-center">
            <div className="relative w-28 h-28">
              <img
                src={selectedFile ? URL.createObjectURL(selectedFile) : user?.profilePic}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-primary"
              />
              <button
                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full shadow text-white"
                onClick={handleEditProfilePic}
              >
                <FaEdit size={14} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <h2 className="mt-4 text-xl font-bold text-primary text-center">
              <FaUser className="inline mr-2" /> {auth?.user?.name || "User"}
            </h2>
            <p className="text-gray-700 text-center">
              <FaEnvelope className="inline mr-2 text-primary" />
              {auth?.user?.email || "email@example.com"}
            </p>
          </CardHeader>
          <CardContent className="mt-6 space-y-4">
            {!auth?.user?.isEmailVerified && (
              <Button
                variant="outline"
                className="w-full bg-primary text-white border-white border-2"
                onClick={emailVerificationOtp}
              >
                Verify Email
              </Button>
            )}
            <Button
              variant="ghost"
              className="w-full bg-primary text-white hover:bg-primary/80"
              onClick={() => navigate("/update-password")}
            >
              <FaKey className="mr-2" /> Update Password
            </Button>
            <Button
              variant="ghost"
              className="w-full bg-red-500 text-white hover:bg-red-600"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </Button>
          </CardContent>
        </Card>

        {/* Overview Card */}
        <motion.div initial={{ x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="w-full lg:w-[30%]">
          <Card className="rounded-3xl shadow-xl border-secondary border-2 bg-secondary/20 backdrop-blur-md h-full">
            <CardHeader className="text-center">
              <h3 className="text-2xl font-semibold text-primary">Account Overview</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="p-4 bg-[#f5eee3] rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-secondary font-medium mb-1">Appointments</h4>
                    <p className="text-sm flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" /> You have <strong>{pendingAppointment} upcoming</strong> appointments
                    </p>
                  </div>
                  <Button className="mt-4 bg-primary text-white hover:bg-secondary transition-all duration-300" onClick={() => navigate("/appointments")}>
                    Go to Appointments <AiOutlineSchedule />
                  </Button>
                </div>

                <div className="p-4 bg-[#f5eee3] rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-secondary font-medium mb-1">Wishlist</h4>
                    <p className="text-sm flex items-center gap-2">
                      <FaHeart className="text-primary" /> Total <strong>{auth.wishlistCount} saved</strong> items
                    </p>
                  </div>
                  <Button className="mt-4 bg-primary text-white hover:bg-secondary transition-all duration-300" onClick={() => navigate("/wishlist")}>
                    View Wishlist <PiListHeart />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-12 text-center max-w-2xl"
      >
        <p className="text-sm text-gray-600">
          Your profile data is securely stored. You can always come back here to
          update your details, check your bookings. Thanks for being with us!
        </p>
      </motion.div>
    </div>
  );
};

export default UserProfile;