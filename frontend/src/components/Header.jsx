import React from "react";
import { assets } from "../assets/assets";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { checkOutPayment } from "../helper/api-communicator";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleClick = async (amount) => {
    try {
      const data = await checkOutPayment(amount);
      // console.log("Data: ", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="relative bg-cover bg-center h-screen flex justify-center items-center overflow-hidden"
      style={{ backgroundImage: `url(${assets.banner2})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute z-0 inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>
      {/* Main content container */}
      <div className="relative flex flex-col gap-4 md:gap-6 z-10 px-6 sm:px-8 w-full max-w-6xl">
        {/* Heading section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary leading-tight">
            Be Faithful To Your Own Taste,
            <br />
            <span className="relative inline-block">
              Because Nothing You Really Like
            </span>
            <br />
            Is Ever Out Of Style..
          </p>
        </motion.div>

        {/* Content with bullet points */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex flex-col gap-4 md:gap-6"
        >
          <div className="flex items-start gap-3 md:gap-4">
            <div className="text-primary mt-1 text-lg md:text-xl">
              <FaArrowRight />
            </div>
            <p className="text-white text-sm sm:text-base md:text-base lg:text-xl font-light">
              Discover personalized interior styling that reflects your
              identity. From minimalistic spaces to bold artistic expressions,
              we help you create environments that feel like home.
            </p>
          </div>

          <div className="flex items-start gap-3 md:gap-4">
            <div className="text-primary mt-1 text-lg md:text-xl">
              <FaArrowRight />
            </div>
            <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-light">
              Our expert designers blend creativity with functionality to craft
              spaces that tell your unique story through textures, colors, and
              forms.
            </p>
          </div>
        </motion.div>

        {/* Stats section - responsive grid */}
        {/* Stats section - responsive grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4"
        >
          <div className="text-center p-2 md:p-4 border-l-4 border-primary">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              15+
            </p>
            <p className="text-white font-medium text-xs sm:text-sm">
              Years Experience
            </p>
          </div>
          <div className="text-center p-2 md:p-4 border-l-4 border-primary">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              500+
            </p>
            <p className="text-white font-medium text-xs sm:text-sm">
              Happy Clients
            </p>
          </div>
          <div className="text-center p-2 md:p-4 border-l-4 border-primary">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              10+
            </p>
            <p className="text-white font-medium text-xs sm:text-sm">
              Awards Won
            </p>
          </div>
          <div className="text-center p-2 md:p-4 border-l-4 border-primary">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
              100%
            </p>
            <p className="text-white font-medium text-xs sm:text-sm">
              Satisfaction
            </p>
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 md:mt-8"
        >
          <Button
            onClick={() => navigate("/new-appointment")}
            variant="secondary"
            className={`bg-primary hover:bg-secondary text-white text-base sm:text-lg font-normal py-4 sm:py-6 px-6 sm:px-4 ${
              auth?.user?.role === "user" ? "flex" : "hidden"
            } items-center gap-2 group w-full sm:w-auto justify-center`}
          >
            Book Your Session Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
