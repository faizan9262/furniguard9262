import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/components/ui/button";
import {
  BellRing,
  CalendarClock,
  HomeIcon,
  InfoIcon,
  LogOutIcon,
  Menu,
  SofaIcon,
  User2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/components/ui/sheet";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../pages/Add";
import { GrUserWorker } from "react-icons/gr";

const Navbar = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (isAuthPage) return null;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...", { toastId: "logout" });
      const response = await axios.post(backendUrl + "/api/user/logout", {
        withCredentials: true,
      });
      console.log("Response logout: ", response);
      toast.success("Logged out successfully", { toastId: "logout" });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const isActive = (path) => {
    const currentPath = location.pathname;

    if (path === "/styles") {
      return (
        currentPath.startsWith("/styles") &&
        !currentPath.startsWith("/styles/livingroom") &&
        !currentPath.startsWith("/styles/layout")
      );
    }
    if (path === "/designers") {
      return currentPath.startsWith("/designers");
    }
    if (path === "/appointments") {
      return currentPath.startsWith("/appointments");
    }
    if (path === "/notifications") {
      return currentPath.startsWith("/notifications");
    }
    return currentPath === path;
  };

  return (
    <header className="max-w-full sticky bg-primary top-0 px-2 py-1 z-50">
      <div className="flex h-14 items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-xl whitespace-nowrap cursor-pointer bg-secondary text-white font-space font-bold border-2 border-white py-1 px-2 rounded-full"
        >
          FurniGuard &reg;
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex mx-4 flex-1 text-white items-center font-space gap-4 justify-evenly">
          <Button
            onClick={() => navigate("/")}
            className={`flex-1 text-sm py-6 font-semibold hover:bg-white ${
              isActive("/")
                ? "bg-secondary border-2 border-white"
                : "text-white"
            }`}
            variant="ghost"
          >
            <div className="flex flex-col items-center justify-center">
              <HomeIcon />
              <span> Home </span>
            </div>
          </Button>

          <Button
            onClick={() => navigate("/appointments")}
            className={`flex-1 text-sm py-6 font-semibold hover:bg-white ${
              isActive("/appointments")
                ? "bg-secondary border-2 border-white"
                : "text-white"
            }`}
            variant="ghost"
          >
            <div className="flex flex-col items-center justify-center">
              <CalendarClock />
              <span> Appointments </span>
            </div>
          </Button>

          <Button
            onClick={() => navigate("/styles")}
            className={`flex-1 text-sm py-6 font-semibold hover:bg-white ${
              isActive("/styles")
                ? "bg-secondary border-2 border-white"
                : "text-white"
            }`}
            variant="ghost"
          >
            <div className="flex flex-col items-center justify-center">
              <SofaIcon />
              <span> Catalog </span>
            </div>
          </Button>

          <Button
            onClick={() => navigate("/designers")}
            className={`flex-1 text-sm py-6 font-semibold hover:bg-white ${
              isActive("/designers")
                ? "bg-secondary border-2 border-white"
                : "text-white"
            }`}
            variant="ghost"
          >
            <div className="flex flex-col items-center justify-center">
              <GrUserWorker />
              <span> Designers </span>
            </div>
          </Button>


          <Button
            onClick={() => navigate("/notifications")}
            className={`flex-1 text-sm py-6 font-semibold hover:bg-white ${
              isActive("/notifications")
                ? "bg-secondary border-2 border-white"
                : "text-white"
            }`}
            variant="ghost"
          >
            <div className="flex flex-col items-center justify-center">
              <BellRing />
              <span> Notifications </span>
            </div>
          </Button>
          
          <Button
            onClick={() => navigate("/about")}
            className={`flex-1 text-sm py-6 font-semibold hover:bg-white ${
              isActive("/about")
                ? "bg-secondary border-2 border-white"
                : "text-white"
            }`}
            variant="ghost"
          >
            <div className="flex flex-col items-center justify-center">
              <InfoIcon />
              <span> About </span>
            </div>
          </Button>

          <Button
            onClick={handleLogout}
            className={`flex-1 text-sm py-6 font-semibold hover:bg-white text-white`}
            variant="ghost"
          >
            <div className="flex flex-col items-center justify-center">
              <LogOutIcon />
              <span> Logout </span>
            </div>
          </Button>
        </nav>

        {/* Mobile Notification Button */}
        <Button
          onClick={() => navigate("/notifications")}
          className={`text-xl md:hidden font-semibold rounded-full p-2 border-2 border-white bg-white hover:bg-primary-foreground ${
            isActive("/notifications") ? "bg-secondary scale-110" : ""
          }`}
          variant="ghost"
        >
          <BellRing className="w-6 h-6 text-primary" />
        </Button>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-secondary border-2 border-white text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-primary rounded-md m-3 border-2 border-white w-64"
          >
            <nav className="flex flex-col items-start font-space gap-4 w-full">
              <Button
                onClick={() => navigate("/")}
                className={`w-full text-xl font-semibold ${
                  isActive("/")
                    ? "bg-secondary border-2 border-white"
                    : "text-white"
                }`}
                variant="ghost"
              >
                <HomeIcon /> Home
              </Button>
              <Button
                onClick={() => navigate("/appointments")}
                className={`w-full text-xl font-semibold ${
                  isActive("/appointments")
                    ? "bg-secondary border-2 border-white"
                    : "text-white"
                }`}
                variant="ghost"
              >
                <CalendarClock /> Appointments
              </Button>
              <Button
                onClick={() => navigate("/products")}
                className={`w-full text-xl font-semibold ${
                  isActive("/products")
                    ? "bg-secondary border-2 border-white"
                    : "text-white"
                }`}
                variant="ghost"
              >
                <SofaIcon /> Products
              </Button>
              <Button
                onClick={() => navigate("/designers")}
                className={`w-full text-xl font-semibold ${
                  isActive("/designers")
                    ? "bg-secondary border-2 border-white"
                    : "text-white"
                }`}
                variant="ghost"
              >
                <User2 /> Designers
              </Button>
              <Button
                onClick={() => navigate("/about")}
                className={`w-full text-xl font-semibold ${
                  isActive("/about")
                    ? "bg-secondary border-2 border-white"
                    : "text-white"
                }`}
                variant="ghost"
              >
                <InfoIcon /> About
              </Button>
              <Button
                onClick={handleLogout}
                className={`w-full text-xl font-semibold bg-secondary rounded-full text-white`}
                variant="ghost"
              >
                <LogOutIcon /> Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
