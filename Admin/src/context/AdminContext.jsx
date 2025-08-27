import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  authStatus,
  getAllAppointments,
  getAllDesigners,
  getProductsByPage,
} from "../helper/apis.js";
import axios from "axios";
import { toast } from "sonner";

export const AdminContex = createContext();

export const AdminContexProvider = (props) => {
  const [messages, setMessages] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [hasMore, setHasMore] = useState(true); // whether more products exist
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const adminLogin = async (email, password) => {
    try {
      const response = await axios.post(
        "/user/admin/login",
        { email, password },
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const data = response.data;
        setIsLoggedIn(true);
        setAdmin({
          email: data.email,
          name: data.name,
          role: data.role,
          profilePicture: data.profilePic,
        });
        return response;
      }
    } catch (error) {
      if (error.response) throw error.response;
      throw error;
    }
  };

  const adminLogout = async () => {
    try {
      const response = await axios.post(
        "/user/admin/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = response.data;
        setIsLoggedIn(false);
        return response;
      }
    } catch (error) {
      if (error.response) throw error.response;
      throw error;
    }
  };

  useEffect(() => {
    if (admin) {
      const checkAuth = async () => {
        const data = await authStatus();
        if (data) {
          setAdmin({
            email: data.email,
            name: data.name,
            isEmailVerified: data.emailVerified,
            role: data.role,
            id: data.id,
            profilePic: data.profilePic,
          });
          setIsLoggedIn(true);
        } else {
          setAdmin({
            email: "",
            name: "",
            isEmailVerified: "",
          });
          setIsLoggedIn(false);
        }
      };
      checkAuth();
    }
  }, []);

  useEffect(() => {
    const getAllDesignerFromDB = async () => {
      try {
        const data = await getAllDesigners();
        setDesigners(data);
        if (data) {
          return;
        }
      } catch (error) {
        toast.error("Failed To Load Designers, Try again.");
      }
    };
    getAllDesignerFromDB();
  }, []);

  const exclude = list.map((p) => p._id);

  const loadProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newProducts = await getProductsByPage(page, exclude);
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setList((prev) => [...prev, ...newProducts]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      toast.error("Failed to load styles,try again.");
    }
    setLoading(false);
  }, [page, hasMore, loading]);

  // initial load
  useEffect(() => {
    loadProducts();
  }, []);

  // scroll listener
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + window.scrollY >=
  //       document.body.offsetHeight - 500
  //     ) {
  //       loadProducts();
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [loading, hasMore, page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const halfHeight = document.body.offsetHeight / 2;
      if (scrolled >= halfHeight) loadProducts();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadProducts]);

  useEffect(() => {
  }, [list]);

  useEffect(() => {
    const getAllAppointmentsOfUser = async () => {
      const data = await getAllAppointments();
      setAllAppointments(data);
    };
    getAllAppointmentsOfUser();
  }, []);

  useEffect(() => {
  }, []);

  const removeAppointment = (id) => {
    setAllAppointments((prev) =>
      prev.filter((appointment) => appointment._id !== id)
    );
  };

  const value = {
    designers,
    removeAppointment,
    allAppointments,
    list,
    setList,
    messages,
    setMessages,
    adminLogin,
    admin,
    setAllAppointments,
    isLoggedIn,
    adminLogout,
    loading,
  };

  return (
    <AdminContex.Provider value={value}>{props.children}</AdminContex.Provider>
  );
};

export const useAdmin = () => useContext(AdminContex);
