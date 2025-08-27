import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Appointments from "./pages/Appointments";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Add from "./pages/Add";
import Login from "./components/Login";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Designers from "./pages/Designers";
import DesignerDetails from "./pages/DesignerDetails";
import AppointmentDetailPage from "./pages/AppointmentDetails";
import About from "./pages/About";
import adminSocket from "./adminSocket";
import ChatBox from "./pages/Chatbox";
import { useAdmin } from "./context/AdminContext";
import AdminMessages from "./pages/AdminMessages";
import AdminChat from "./pages/AdminChat";
import Catalog from "./pages/Catalog";
import StyleDetails from "./components/StyleDetails";
import EditStyleDetails from "./pages/EditStyleDetails";
import Payments from "./pages/Payment"; // import ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const adminContext = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbar =
    !adminContext.isLoggedIn && (location.pathname.startsWith("/chat/")) ||
    location.pathname.startsWith("/chats/");

  // Socket connections
  useEffect(() => {
    const handleConnect = () => {
      // console.log("Connected with ID:", adminSocket.id);
    };
    const handleDisconnect = () => {
      // console.log("Disconnected from socket");
    };
    const handleReceive = (msg) => {
      // console.log("Recoved msg: ", msg);
      adminContext.setMessages((prev) => [...prev, msg]);
    };

    adminSocket.on("connect", handleConnect);
    adminSocket.on("disconnect", handleDisconnect);
    adminSocket.on("receive-message", handleReceive);

    return () => {
      adminSocket.off("connect", handleConnect);
      adminSocket.off("disconnect", handleDisconnect);
      adminSocket.off("receive-message", handleReceive);
    };
  }, []);

  useEffect(() => {
    adminSocket.emit("join", adminContext?.admin?.role);
    console.log("Role in admin: ", adminContext?.admin?.role);
  }, [adminContext?.admin]);

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/styles"
          element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/styles/:category/:id"
          element={
            <ProtectedRoute>
              <StyleDetails />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-style/:category/:id"
          element={
            <ProtectedRoute>
              <EditStyleDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/:id"
          element={
            <ProtectedRoute>
              <AppointmentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:senderId/:receiverId"
          element={
            <ProtectedRoute>
              <ChatBox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:receiverId/:receiverRole"
          element={
            <ProtectedRoute>
              <AdminChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <AdminMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/designers"
          element={
            <ProtectedRoute>
              <Designers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/designers/:id"
          element={
            <ProtectedRoute>
              <DesignerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
