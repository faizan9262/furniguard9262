import React from "react";
import RoomCard from "../components/RoomCard";
import { useNavigate } from "react-router-dom";
import { useStyle } from "../context/StyleContext";
import { motion } from "framer-motion";
import { RoomsPageSkeleton } from "@/components/skeletons/RoomPageSkeleton";

const Rooms = () => {
  const navigate = useNavigate();
  const { products, loading, hasMore } = useStyle();

  const rooms = products.filter((r) => r.category === "livingroom");

  // Show skeleton only on first load
  if (loading && rooms.length === 0) {
    return <RoomsPageSkeleton />;
  }

  return (
    <div className="mx-4 sm:mx-[5%] md:mx-[2%] my-10">
      <motion.div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-h-screen"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {rooms.map((item) => (
          <motion.div
            key={item._id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <RoomCard
              onClick={() => navigate(`/styles/livingrooms/${item._id}`)}
              title={item.name}
              img_src={item.image}
              description={item.description}
              price={item.price}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Rooms;
