import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useStyle } from "../context/StyleContext";
import LayoutCard from "./LayoutCard";

const BedRoom = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const product = useStyle()

  const furniture = product.products.filter((fr)=> fr.category === "furniture")
  
  
  const filterdFurniture = furniture.slice(1,3)



  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3, ease: "easeOut" },
    }),
  };

  return (
    <div
      ref={sectionRef}
      className="w-full h-full mt-4 px-6 py-6 bg-gradient-to-r from-[#ffd9b9] via-primary to-secondary"
    >
      <div className="mx-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <AnimatePresence>
          {filterdFurniture.map((fr, i) => {
            // Show only first 2 on small, all 4 on large
            const showOnSmall = i < 2 ? "block" : "hidden";
            const showOnLarge = "lg:block";
            return (
              <motion.div
                key={fr.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className={`${showOnSmall} ${showOnLarge}`}
              >
                <LayoutCard
                  onClick={() => {
                    navigate(`/styles/${fr.category}/${fr._id}`);
                    window.scroll(0, 0);
                  }}
                  title={fr.name?.split(" ").slice(0, 2).join(" ")}
                  img_scr={fr.image}
                  description={fr.description}
                  tag={"Furniture"}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BedRoom;
