import React, { useEffect, useState } from "react";
import DesignBannerLeft from "./DesignBannerLeft";
import DesignBannerRight from "./DesignBannerRight";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";
import { useStyle } from "../context/StyleContext";

const Design = () => {
  const navigate = useNavigate();
  const style = useStyle();

  const filterLayout = style.layout.slice(1, 3);

  return (
    <div className="mx-10  sm:mx-[5%]">
      {filterLayout.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <DesignBannerLeft
            title={filterLayout[0].name}
            img_src={filterLayout[0].image}
            description={filterLayout[0].description}
            onClick={() =>
              navigate(
                `/styles/${filterLayout[0].category}/${filterLayout[0]._id}`
              )
            }
          />
          <DesignBannerRight
            title={filterLayout[1].name}
            img_src={filterLayout[1].image}
            description={filterLayout[1].description}
            onClick={() =>
              navigate(
                `/styles/${filterLayout[1].category}/${filterLayout[1]._id}`
              )
            }
          />
        </motion.div>
      )}
    </div>
  );
};

export default Design;
