import React from "react";
import LayoutCard from "../components/LayoutCard";
import { useNavigate } from "react-router-dom";
import { useStyle } from "../context/StyleContext";
import { LayoutsPageSkeleton } from "@/components/skeletons/LayoutPageSkeleton";

const Layout = () => {
  const navigate = useNavigate();
  const { layout, loading } = useStyle(); // assume your context provides loading

  // Show skeleton only on first load
  if (loading && (!layout || layout.length === 0)) {
    return <LayoutsPageSkeleton />;
  }

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
