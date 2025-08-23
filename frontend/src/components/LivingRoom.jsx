import React, { useEffect, useRef, useState } from "react";
import RoomCard from "./RoomCard";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/components/ui/button";
import { Separator } from "@/components/components/ui/separator";
import { FaArrowRight } from "react-icons/fa";
import { useStyle } from "../context/StyleContext";
import { toast } from "sonner";
import axios from "axios";

const LivingRoom = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const style = useStyle()

  const filteredLivingRooms = style.livingroom.slice(0, 4);
  

  return (
    <>
      <div
        ref={sectionRef}
        className="mx-10 my-5 flex items-center justify-center sm:mx-[5%]"
      >
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
          {filteredLivingRooms.map((lv, i) => {
            const visibilityClass = i < 2 ? "block" : "hidden sm:block";

            return (
              <div key={i} className={visibilityClass}>
                <RoomCard
                  onClick={() => {
                    window.scroll(0, 0);
                    navigate(`/styles/livingroom/${lv._id}`);
                  }}
                  img_src={lv.image}
                  title={lv.name}
                  description={lv.description}
                  price={lv.price}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LivingRoom;
