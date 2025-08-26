import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  getAllWishlistProducts,
  getProductsByPage,
} from "../helper/api-communicator.js";
import { useAuth } from "./AuthContext.jsx";
import { toast } from "sonner";

export const StyleContext = createContext();

export const StyleContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1); // current page
  const [hasMore, setHasMore] = useState(true); // whether more products exist
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [layout, setLayout] = useState([]);
  const [livingroom, setLivingRoom] = useState([]);
  const [stairs, setStairs] = useState([]);
  const user = useAuth();

  useEffect(() => {
    const getLayout = async () => {
      try {
        const response = await axios.get(
          "/products/home?categories=layout&limit=10"
        );
        const data = response.data.data;
        setLayout(data.map((d) => d));
      } catch (error) {
        toast.error("Failed to load livingrooms");
      }
    };
    getLayout();
  }, []);

  useEffect(() => {
    const getLivingRoom = async () => {
      try {
        const response = await axios.get(
          "/products/home?categories=livingroom&limit=4"
        );
        const data = response.data.data;
        setLivingRoom(data.map((d) => d));
      } catch (error) {
        toast.error("Failed to load livingrooms");
      }
    };
    getLivingRoom();
  }, []);

  useEffect(() => {
    const getstairs = async () => {
      try {
        const response = await axios.get(
          "/products/home?categories=stairs&limit=4"
        );
        const data = response.data.data;
        setStairs(data.map((d) => d));
      } catch (error) {
        toast.error("Failed to load stairs");
      }
    };
    getstairs();
  }, []);

  const exclude = products.map((p) => p._id);

  const loadProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const newProducts = await getProductsByPage(page, exclude);
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      toast.error("Failed to load styles");
    }
    setLoading(false);
  }, [page, hasMore, loading]);

  // initial load
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const halfHeight = document.body.offsetHeight / 2;
      if (scrolled >= halfHeight) loadProducts();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadProducts]);
  // only add once

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getAllWishlistProducts();
        setWishlist(response.data.products || []);
        user.setWishlistCount(response.data.products.length);
      } catch (error) {
        toast.error("Failed to fetching wishlist");
      }
    };

    fetchWishlist();
  }, []);

  const value = {
    products,
    wishlist,
    setWishlist,
    layout,
    livingroom,
    stairs,
  };
  return (
    <StyleContext.Provider value={value}>
      {props.children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => useContext(StyleContext);
