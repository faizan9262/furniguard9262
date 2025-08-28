import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../components/components/ui/input";
import { useStyle } from "../context/StyleContext";
import ProductCard from "../components/StyleCard";
import Masonry from "react-masonry-css";
import { CiGrid42 } from "react-icons/ci";
import {
  TbBath,
  TbWood,
  TbArmchair,
  TbToolsKitchen2,
  TbLayoutDashboard,
  TbBulb,
  TbSofa,
  TbStairs,
  TbWashMachine,
  TbWallpaper,
} from "react-icons/tb";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/components/ui/select";

const Styles = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const product = useStyle();
  const [searchQuery, setSearchQuery] = useState("");

  const breakpointColumnsObj = {
    default: 4,
    1400: 4,
    992: 3,
    600: 2,
  };

  const categoryIcons = {
    all: <CiGrid42 className="text-xl text-primary" />,
    bathroom: <TbBath className="text-xl text-primary" />,
    flooring: <TbWood className="text-xl text-primary" />,
    furniture: <TbArmchair className="text-xl text-primary" />,
    kitchen: <TbToolsKitchen2 className="text-xl text-primary" />,
    layout: <TbLayoutDashboard className="text-xl text-primary" />,
    lights: <TbBulb className="text-xl text-primary" />,
    livingroom: <TbSofa className="text-xl text-primary" />,
    stairs: <TbStairs className="text-xl text-primary" />,
    textile: <TbWashMachine className="text-xl text-primary" />,
    wallpaper: <TbWallpaper className="text-xl text-primary" />,
  };

  const categories = [
    "all",
    "bathroom",
    "flooring",
    "furniture",
    "kitchen",
    "layout",
    "lights",
    "livingroom",
    "stairs",
    "textile",
    "wallpaper",
  ];

  const allProducts = product.products;
  const filteredProducts =
    allProducts?.filter((p) => {
      const matchCategory =
        !category || category === "all" || p.category === category;
      const title = p?.title || p?.name || "";
      const description = p?.description || "";
      const matchSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }) || [];

    console.log("Styels: ",filteredProducts);
    

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 bg-gradient-to-br from-white via-[#fdf7f0] to-[#fff5e6]">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
        <Input
          placeholder="Search Styles..."
          className="sm:w-1/2 border-b-4 border-r-4 border-secondary/40 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={category || "all"}
          onValueChange={(value) =>
            navigate(`/styles/${value === "all" ? "" : value}`)
          }
        >
          <SelectTrigger className="w-[200px] border-b-4 border-r-4 border-secondary/40 bg-white text-primary font-medium">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-primary text-primary shadow-lg">
            {categories.map((cat) => (
              <SelectItem
                key={cat}
                value={cat}
                className="flex items-center gap-2"
              >
                {categoryIcons[cat]}
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!allProducts ? (
        // 🔹 Skeleton loader grid
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : filteredProducts?.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-2 md:gap-4"
          columnClassName="space-y-2 md:space-y-4"
        >
          {filteredProducts.map((product,index) => (
            <div key={product._id + index} className="break-inside-avoid">
              <ProductCard
                id={product._id}
                img_src={product.image || product.images[0]}
                title={product.name}
                description={product.description}
                category={product.category}
                price={product.price}
                onClick={() =>
                  navigate(`/styles/${product.category}/${product._id}`)
                }
              />
            </div>
          ))}
        </Masonry>
      ) : (
        <p className="text-center text-gray-500">No Styles found.</p>
      )}
    </div>
  );
};

export default Styles;
