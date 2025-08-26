import React, { useState } from "react";
import { Button } from "../components/components/ui/button";
import {
  HomeIcon,
  CalendarClock,
  SofaIcon,
  User2,
  MessageSquare,
  LogOutIcon,
  LayoutPanelLeftIcon,
  InfoIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../components/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { TbTransactionRupee } from "react-icons/tb";
import { toast } from "sonner";
import { useAdmin } from "../context/AdminContext";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const adminContext = useAdmin();

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Styles", icon: SofaIcon, path: "/styles" },
    { label: "Appointments", icon: CalendarClock, path: "/appointments" },
    { label: "Designers", icon: User2, path: "/designers" },
    { label: "Chat", icon: MessageSquare, path: "/notifications" },
    { label: "Payments", icon: TbTransactionRupee, path: "/payments" },
    { label: "About", icon: InfoIcon, path: "/about" },
    { label: "Logout", icon: LogOutIcon },
  ];

  const isActive = (path) => {
    const currentPath = location.pathname;
    if (!path) return false;
    if (path === "/styles") {
      return (
        currentPath.startsWith("/styles") &&
        !currentPath.startsWith("/styles/livingroom") &&
        !currentPath.startsWith("/styles/layout")
      );
    }
    if (path === "/designers") return currentPath.startsWith("/designers");
    if (path === "/appointments")
      return currentPath.startsWith("/appointments");
    if (path === "/notifications")
      return currentPath.startsWith("/notifications");
    return currentPath === path;
  };

  const handleLogout = async () => {
    try {
      const response = await adminContext.adminLogout();
      toast.success("Admin logged out successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <header className="w-full sticky bg-primary top-0 px-2 z-50">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-md md:text-lg cursor-pointer bg-secondary text-white font-space font-bold border-2 border-white py-1 px-2 rounded-full whitespace-nowrap"
        >
          FurniGuard &reg;
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex text-white items-center font-space gap-1">
          {menuItems.map((item) =>
            item.label === "Logout" ? (
              <AlertDialog
                key={item.label}
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    className={`text-sm py-6 font-semibold text-white hover:bg-secondary hover:border-2 border-white hover:text-white`}
                    variant="ghost"
                  >
                    <div className="flex flex-col items-start">
                      <item.icon /> <span>{item.label}</span>
                    </div>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-500">Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription className="text-primary">
                      Are you sure you want to logout?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setLogoutDialogOpen(false)}
                      className="bg-primary border-none hover:bg-secondary tetx-white hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setLogoutDialogOpen(false);
                        handleLogout();
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Logout
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`text-sm py-6 font-semibold ${
                  isActive(item.path)
                    ? "bg-secondary border-2 border-white hover:bg-primary hover:text-white"
                    : "text-white hover:bg-secondary hover:border-2 border-white hover:text-white"
                }`}
                variant="ghost"
              >
                <div className="flex flex-col items-start">
                  <item.icon /> <span>{item.label}</span>
                </div>
              </Button>
            )
          )}
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden rounded-full p-2 h-10 w-10 bg-secondary border-2 text-white"
              >
                <LayoutPanelLeftIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-primary h-[80%] rounded-sm m-3 border-2 border-white w-60"
            >
              <nav className="flex flex-col items-start font-space gap-4 mt-10">
                {menuItems.map((item) =>
                  item.label === "Logout" ? (
                    <AlertDialog
                      key={item.label}
                      open={logoutDialogOpen}
                      onOpenChange={setLogoutDialogOpen}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          className="text-xl font-semibold text-white"
                          variant="ghost"
                          onClick={() => setOpen(false)}
                        >
                          <item.icon /> {item.label}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to logout?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setLogoutDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              setLogoutDialogOpen(false);
                              handleLogout();
                            }}
                          >
                            Logout
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button
                      key={item.label}
                      onClick={() => {
                        setOpen(false);
                        navigate(item.path);
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
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
