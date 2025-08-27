import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import axios from "axios";
import { Toaster } from "./components/components/ui/sonner";
import { StyleContextProvider } from "./context/StyleContext";
import { DesignerContexProvider } from "./context/DesignerContex";
import { AppointmentsContexProvider } from "./context/AppointmentsContex";

axios.defaults.baseURL = "https://furniguard9262-production.up.railway.app/api";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StyleContextProvider>
          <DesignerContexProvider>
            <AppointmentsContexProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "white", // custom background color
                    color: "#BC8A5F",
                  },
                }}
              />
            </AppointmentsContexProvider>
          </DesignerContexProvider>
        </StyleContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
