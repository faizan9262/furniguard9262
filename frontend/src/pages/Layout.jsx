import React from "react";
import LayoutCard from "../components/LayoutCard";
import { useNavigate } from "react-router-dom";
import { useStyle } from "../context/StyleContext";
import { motion } from "framer-motion";

const Layout = () => {
  const navigate = useNavigate();
  const product = useStyle();

  const layout = product.products.filter((l) => l.category === "layout");

  return (
    <div className="my-10 mx-4 sm:mx-[5%] md:mx-[2%]">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-8 min-h-screen"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {layout.map((item, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <LayoutCard
              onClick={() => navigate(`/products/layout/${item._id}`)}
              title={item.name}
              img_scr={item.image}
              description={item.description}
              tag={"Room Layout"}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Layout;