import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import socket from "./socket.js";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import PublicRoute from "./components/PublicRoutes.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Products = lazy(() => import("./pages/Styles.jsx"));
const Layout = lazy(() => import("./pages/Layout.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Designers = lazy(() => import("./pages/Designers.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const DesignerDetail = lazy(() => import("./components/DesignerDetail.jsx"));
const Rooms = lazy(() => import("./pages/Rooms.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Appointments = lazy(() => import("./pages/Appointments.jsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.jsx"));
const PasswordUpdate = lazy(() => import("./pages/PasswordUpdate.jsx"));
const PasswordReset = lazy(() => import("./pages/PasswordReset.jsx"));
const AppointmentDetailPage = lazy(() => import("./pages/AppointmentDetails.jsx"));
const NewAppointment = lazy(() => import("./pages/NewAppointment.jsx"));
const ChatBox = lazy(() => import("./pages/Chatbox.jsx"));
const Inbox = lazy(() => import("./pages/Inbox.jsx"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess.jsx"));
const StyleDetail = lazy(() => import("./components/StyleDetail.jsx"));
const Styles = lazy(() => import("./pages/Styles.jsx"));

function App() {
  const auth = useAuth();
  const location = useLocation();

  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});
    return () => {
      socket.off("connect");
      socket.off("disconnect");
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
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/chat/:receiverId/:receiverRole"
              element={
                <ProtectedRoute>
                  <ChatBox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
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
        </Suspense>
      </div>
    </>
  );
}


export default App;
