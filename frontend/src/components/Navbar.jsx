import React, { useState } from "react";
import { Button } from "../components/components/ui/button";
import {
  BedDoubleIcon,
  CalendarClock,
  HeartIcon,
  HomeIcon,
  InfoIcon,
  LayoutPanelLeftIcon,
  Menu,
  MessageSquare,
  SofaIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GrUserWorker } from "react-icons/gr";

const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isDesigner = auth?.user?.role === "designer";

  const isActive = (path) => {
    const currentPath = location.pathname;
    if (path === "/styles") {
      return (
        currentPath.startsWith("/styles") &&
        !currentPath.startsWith("/styles/livingroom") &&
        !currentPath.startsWith("/styles/layout")
      );
    }
    if (path === "/rooms") {
      return (
        currentPath.startsWith("/styles/livingroom") ||
        currentPath === "/rooms"
      );
    }
    if (path === "/layout") {
      return (
        currentPath.startsWith("/styles/layout") ||
        currentPath === "/layout"
      );
    }
    if (path === "/designers") return currentPath.startsWith("/designers");
    if (path === "/appointments") return currentPath.startsWith("/appointments");
    if (path === "/notifications") return currentPath.startsWith("/notifications");
    return currentPath === path;
  };

  const menuItems = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Appointments", icon: CalendarClock, path: "/appointments" },
    { label: "Catalog", icon: SofaIcon, path: "/styles" },
    { label: "Rooms", icon: BedDoubleIcon, path: "/rooms" },
    { label: "Layouts", icon: LayoutPanelLeftIcon, path: "/layout" },
    { label: "Designer", icon: GrUserWorker, path: "/designers" },
    { label: "Wishlist", icon: HeartIcon, path: "/wishlist" },
    { label: "About", icon: InfoIcon, path: "/about" },
  ];

  return (
    <header className="w-full sticky bg-primary top-0 px-2 z-50">
      <div className="flex h-16 items-center justify-between">
        {/* Avatar (Mobile) */}
        <div className="flex lg:hidden gap-2">
          {auth.isLoggedIn && (
            <Avatar
              onClick={() => navigate("/profile")}
              className="w-10 border-white border-2 h-10"
            >
              <AvatarImage src={auth?.user?.profilePic} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-md md:text-lg cursor-pointer bg-secondary text-white font-space font-bold border-2 py-1 px-2 rounded-full whitespace-nowrap"
        >
          FurniGuard &reg;
        </div>

        {/* Desktop Nav - visible from lg and above */}
        <nav className="hidden lg:flex text-white items-center font-space gap-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-sm py-6 font-semibold ${
                isActive(item.path)
                  ? "bg-secondary border-2 border-white"
                  : "text-white"
              } ${
                item.label === "Wishlist" && isDesigner && "hidden"
              } ${
                item.label === "Designer" && isDesigner && "hidden"
              }`}
              variant="ghost"
            >
              <div className="flex flex-col items-start">
                <item.icon /> <span>{item.label}</span>
              </div>
            </Button>
          ))}

          <Button
            onClick={() => navigate("/inbox")}
            variant="ghost"
            className={`rounded-full border-2 p-2 h-10 w-10 bg-secondary border-white ${
              isActive("/inbox")
                ? " text-primary bg-white"
                : "text-white hover:bg-white hover:text-primary"
            }`}
          >
            <MessageSquare />
          </Button>
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {auth.isLoggedIn ? (
            <Avatar
              onClick={() => navigate("/profile")}
              className="hidden lg:block border-white border-2 w-11 h-11"
            >
              <AvatarImage src={auth?.user?.profilePic} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <Button
              className="border-2 border-white hover:border-none text-lg rounded-md py-2 px-4 text-white font-semibold"
              variant="ghost"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          )}

          {/* Mobile Inbox Button */}
          <Button
            onClick={() => navigate("/inbox")}
            variant="ghost"
            className={`lg:hidden rounded-full p-2 h-10 w-10 flex items-center justify-center border-2 bg-secondary border-white ${
              isActive("/inbox")
                ? " text-secondary bg-white shadow-md"
                : "text-white hover:bg-white hover:text-primary"
            }`}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* Mobile Sheet Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden rounded-full p-2 h-10 w-10 bg-secondary border-2 text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-primary h-[80%] rounded-sm m-3 border-2 border-white w-60"
            >
              <nav className="flex flex-col items-start font-space gap-4 mt-10">
                {auth.isLoggedIn && (
                  <div className="flex items-center justify-center gap-1">
                    <Avatar
                      onClick={() => {
                        navigate("/profile");
                        setOpen(false);
                      }}
                      className="ml-4 w-8 border-white border-2 h-8"
                    >
                      <AvatarImage src={auth?.user?.profilePic} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-center">
                      <p className="font-bold text-white text-sm">
                        {auth?.user?.name}
                      </p>
                      <p className="font-light text-white text-xs">
                        {auth?.user?.email}
                      </p>
                    </div>
                  </div>
                )}

                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                    className={`text-xl font-semibold ${
                      isActive(item.path)
                        ? "bg-secondary mx-2 border-2 border-white"
                        : "text-white"
                    }`}
                    variant="ghost"
                  >
                    <item.icon /> {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
