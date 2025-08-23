import React, { useEffect, useState } from "react";
import LayoutCard from "../components/LayoutCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const SkeletonCard = () => (
  <div className="border rounded-2xl bg-gray-200 animate-pulse h-64 w-full" />
);

const Layout = () => {
  const navigate = useNavigate();
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getLayouts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/products/home?categories=layout");
        setLayout(response.data.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load layouts.");
        setLoading(false);
      }
    };
    getLayouts();
  }, []);

  return (
    <div className="my-10 mx-4 sm:mx-[5%] md:mx-[2%]">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-4 min-h-screen">
        {layout?.map((item) => (
              <LayoutCard
                key={item._id}
                onClick={() => navigate(`/styles/layout/${item._id}`)}
                title={item.name}
                img_scr={item.image}
                description={item.description}
                tag={"Room Layout"}
              />
            ))}
      </div>
    </div>
  );
};

export default Layout;
