import { Route, Routes, useLocation } from "react-router-dom";

import Appointments from "./pages/Appointments";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Add from "./pages/Add";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { backendUrl } from "./pages/Add";
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

function App() {
  const [authenticated, setAuthenticated] = useState(null); // null = checking
  const adminContext = useAdmin()
  const location =  useLocation()
  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected with ID:", adminSocket.id);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from socket");
    };

    const handleReceive = (msg)=>{
      console.log("Recoved msg: ",msg);
      adminContext.setMessages((prev) => [...prev, msg])
    }

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
    adminSocket.emit("join",adminContext?.admin?.role );
    console.log("Role in admin: ",adminContext?.admin?.role);
    
  }, [adminContext?.admin]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/admin/check-auth`, {
          withCredentials: true,
        });

        // console.log("Admin auth check: ", res);

        if (res.data.success) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
        console.log("Auth check failed", err);
      }
    };

    checkAuth();
  }, []);

  if (authenticated === null) {
    return <div className="text-center p-10">Checking auth...</div>;
  }

  const hideNavbar = location.pathname.startsWith("/chat/") || location.pathname.startsWith("/chats/");

  return (
    <div>
        <>
          {!hideNavbar && <Navbar setAuthenticated={setAuthenticated} />}
          <Routes>
            <Route path="/" element={<Home />} />
            {
              
            }
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/add" element={<Add />} />
            <Route path="/styles" element={<Catalog />} />
            <Route path="/styles/:category/:id" element={<StyleDetails />} />
            <Route path="/edit-style/:category/:id" element={<EditStyleDetails />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route
              path="/appointments/:id"
              element={<AppointmentDetailPage />}
            />
            

            <Route path="/chat/:senderId/:receiverId" element={<ChatBox />} />
            <Route path="/chats/:receiverId/:receiverRole" element={<AdminChat />} />
            <Route path="/notifications" element={<AdminMessages />} />

            <Route path="/designers" element={<Designers />} />
            <Route path="/designers/:id" element={<DesignerDetails />} />
          </Routes>
        </>
    </div>
  );
}

export default App;
