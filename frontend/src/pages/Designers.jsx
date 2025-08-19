import React, { useEffect, useState } from "react";
import DesignerCard from "../components/DesignerCard";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/components/ui/input";
import { Label } from "../components/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../components/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useDesiner } from "../context/DesignerContex";
import { useAuth } from "../context/AuthContext";

const Designers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const auth = useAuth()

  const designer = useDesiner();

  const filterDesigners = designer.designers.filter((item) => {
    const matchesSearch =
      item.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase());

    const experience = item.experience;

    const matchesExperience = (() => {
      switch (experienceFilter) {
        case "2-5":
          return experience >= 2 && experience <= 5;
        case "5-10":
          return experience > 5 && experience <= 10;
        case "10-15":
          return experience > 10 && experience <= 15;
        case "16-20":
          return experience > 15 && experience <= 20;
        case "20+":
          return experience > 20;
        case "all":
        case "":
          return true;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesExperience;
  });

  useEffect(()=>{
    if(auth.user.role === "designer"){
      navigate('/')
    }
  },[auth.user.role])

  return (
    <div className="mx-4 sm:mx-[5%] md:mx-[5%] min-h-screen my-5">

      {/* Search and Filter Controls */}
      <div className="p-4 rounded-xl flex flex-wrap gap-4 justify-center items-end">
        <Input
          type="text"
          placeholder="Search by name or type..."
          className="w-full sm:w-[66%] border-primary/40 border-b-4 border-r-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex flex-col">
          <Select onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-24 md:w-32 border-b-4 border-r-4 border-primary/40">
              {experienceFilter === "" || experienceFilter === "all"
                ? "All"
                : `${experienceFilter} Years`}
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="2-5">2 - 5 Years</SelectItem>
              <SelectItem value="5-10">5 - 10 Years</SelectItem>
              <SelectItem value="10-15">10 - 15 Years</SelectItem>
              <SelectItem value="16-20">16 - 20 Years</SelectItem>
              <SelectItem value="20+">20+ Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Designer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        <AnimatePresence>
          {filterDesigners.length > 0 ? (
            filterDesigners.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <DesignerCard
                  onClick={() => navigate(`/designers/${item._id}`)}
                  name={item.user.username}
                  type={item.type}
                  profile_img={item.user.profilePicture}
                  experience={item.experience}
                  bio={item.bio}
                  averageRating={item.averageRating}
                  totalRatings={item.totalRatings}
                  joining={item.createdAt}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center text-gray-500 text-lg"
            >
              No designers found.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Designers;
