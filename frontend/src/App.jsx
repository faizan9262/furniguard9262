import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Styles.jsx";
import Layout from "./pages/Layout.jsx";
import About from "./pages/About.jsx";
import Navbar from "./components/Navbar.jsx";
import Register from "./pages/Register.jsx";
import Designers from "./pages/Designers.jsx";
import Login from "./pages/Login.jsx";
import DesignerDetail from "./components/DesignerDetail.jsx";
import Rooms from "./pages/Rooms.jsx";
import Profile from "./pages/Profile.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Appointments from "./pages/Appointments.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import PasswordUpdate from "./pages/PasswordUpdate.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import AppointmentDetailPage from "./pages/AppointmentDetails.jsx";
import NewAppointment from "./pages/NewAppointment.jsx";
import { useEffect } from "react";
import socket from "./socket.js";
import ChatBox from "./pages/Chatbox.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Inbox from "./pages/Inbox.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import PublicRoute from "./components/PublicRoutes.jsx";
import StyleDetail from "./components/StyleDetail.jsx";
import Styles from "./pages/Styles.jsx";

function App() {
  const auth = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleConnect = () => {
    };

    const handleDisconnect = () => {
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    if (auth?.user?.id) {
      socket.emit("join", auth?.user?.id);
    }
  }, [auth?.user?.id]);

  const hideNavbar = location.pathname.startsWith("/chat/");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/chat/:receiverId/:receiverRole"
            element={
              <ProtectedRoute>
                {" "}
                <ChatBox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                {" "}
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route path="/styles" element={<Products />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/styles/:category/:id" element={<StyleDetail />} />
          <Route path="/styles/:category" element={<Styles />} />
          <Route path="/layout" element={<Layout />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<Rooms />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route path="/designers" element={<Designers />} />
          <Route path="/designers/:id" element={<DesignerDetail />} />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
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
            path="/new-appointment"
            element={
              <ProtectedRoute>
                <NewAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/verify-email"
            element={
              <ProtectedRoute>
                <VerifyEmail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-password"
            element={
              <ProtectedRoute>
                <PasswordUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute>
                <PasswordReset />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
