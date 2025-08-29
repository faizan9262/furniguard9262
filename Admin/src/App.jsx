import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import { useAdmin } from "./context/AdminContext";
import ProtectedRoute from "./components/ProtectedRoute";
import adminSocket from "./adminSocket";
import HomeSkeleton from "./components/skletons/HomeSkeleton";
import CatalogPageSkeleton from "./components/skletons/CatalogSkeleton";
import AppointmentsPageSkeleton from "./components/skletons/ApPageSkeleton";
import DesignersPageSkeleton from "./components/skletons/DesignersPageSkeleton";
import PaymentsPageSkeleton from "./components/skletons/PaymentsSkeleton";

// import Appointments from "";
const Appointments = lazy(() => import("./pages/Appointments"));
const Home = lazy(() => import("./pages/Home"));
const Add = lazy(() => import("./pages/Add"));
const Login = lazy(() => import("@/components/Login"));
const Designers = lazy(() => import("./pages/Designers"));
const DesignerDetails = lazy(() => import("./pages/DesignerDetails"));
const About = lazy(() => import("./pages/About"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminChat = lazy(() => import("./pages/AdminChat"));
const ChatBox = lazy(() => import("./pages/Chatbox"));
const Catalog = lazy(() => import("./pages/Catalog"));
const StyleDetails = lazy(() => import("./components/StyleDetails"));
const EditStyleDetails = lazy(() => import("./pages/EditStyleDetails"));
const Payments = lazy(() => import("./pages/Payment"));
const AppointmentDetailPage = lazy(() => import("./pages/AppointmentDetails"));

function App() {
  const adminContext = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbar =
    (!adminContext.isLoggedIn && location.pathname.startsWith("/chat/")) ||
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
              <Suspense fallback={<HomeSkeleton />}>
                <Home />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading...</p>}>
                <About />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/styles"
          element={
            <ProtectedRoute>
              <Suspense fallback={<CatalogPageSkeleton />}>
                <Catalog />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/styles/:category/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading</p>}>
                <StyleDetails />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading</p>}>
                <Add />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-style/:category/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading</p>}>
                <EditStyleDetails />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Suspense fallback={<AppointmentsPageSkeleton />}>
                <Appointments />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading</p>}>
                <AppointmentDetailPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:senderId/:receiverId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading</p>}>
                <ChatBox />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:receiverId/:receiverRole"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading</p>}>
                <AdminChat />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading</p>}>
                <AdminMessages />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/designers"
          element={
            <ProtectedRoute>
              <Suspense fallback={<DesignersPageSkeleton />}>
                <Designers />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/designers/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<p>Loading</p>}>
                <DesignerDetails />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PaymentsPageSkeleton />}>
                <Payments />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
