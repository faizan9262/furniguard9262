import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAllAppointments,
  getAllAppointmentsOfDesigner,
} from "../helper/api-communicator.js";
import { useAuth } from "./AuthContext.jsx";

export const AppointmentsContex = createContext();

export const AppointmentsContexProvider = (props) => {
  const auth = useAuth();
  const [allAppointments, setAllAppointments] = useState([]);
  const [DesignerAllAppointments, setDesignerAllAppointmentsOfDesigner] =
    useState([]);

  useEffect(() => {
    if (auth.isLoggedIn) {
      const getAllAppointmentsOfUser = async () => {
        const data = await getAllAppointments();
        // console.log("Ap Data:",data);
        setAllAppointments(data);
      };
      getAllAppointmentsOfUser();
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    console.log("User Aoopintments Array:",allAppointments);
  }, [allAppointments]);

  useEffect(() => {
    if (auth.isLoggedIn) {
      const getAppointmentsOfDesigner = async () => {
        const data = await getAllAppointmentsOfDesigner();
        console.log("Ap Data Designer:", data);
        setDesignerAllAppointmentsOfDesigner(data);
      };
      getAppointmentsOfDesigner();
    }
  }, [auth.isLoggedIn]);

  useEffect(() => {
    console.log("Aoopintments Array Designer:",DesignerAllAppointments);
  }, [DesignerAllAppointments]);

  const removeAppointment = (id) => {
    setAllAppointments((prev) =>
      prev.filter((appointment) => appointment._id !== id)
    );
  };
  const addAppointment = (newAppointment) => {
    setAllAppointments((prev) => [newAppointment, ...prev]);
  };

  const value = {
    allAppointments,
    removeAppointment,
    addAppointment,
    DesignerAllAppointments,
  };

  return (
    <AppointmentsContex.Provider value={value}>
      {props.children}
    </AppointmentsContex.Provider>
  );
};

export const useAppointment = () => useContext(AppointmentsContex);
