import React from "react";
import { Card, CardTitle } from "./components/ui/card";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { addToWishlist } from "../helper/api-communicator";

// ✅ Skeleton sub-component
const StyleCardSkeleton = () => (
  <div className="cursor-pointer w-full overflow-hidden rounded-2xl shadow-lg animate-pulse">
    <Card className="relative w-full overflow-hidden rounded-2xl group p-0">
      {/* Image placeholder */}
      <div className="w-full aspect-[3/4] bg-gray-200" />

      {/* Wishlist Button placeholder */}
      <div className="absolute top-3 right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-300" />

      {/* Category placeholder */}
      <div className="absolute top-3 left-3 h-4 w-12 md:w-16 rounded-full bg-gray-300" />

      {/* Title placeholder */}
      <div className="absolute bottom-3 left-3 h-4 w-20 md:w-32 bg-gray-300 rounded" />
    </Card>
  </div>
);

const StyleCard = ({
  id,
  img_src,
  title,
  description,
  category,
  price,
  onClick,
  isLoading = false, // ✅ added prop for skeleton
}) => {
  const handleAddWishlist = async (id) => {
    try {
      toast.loading("Adding to Wishlist", { id: "wishlist" });
      await addToWishlist(id);
      toast.success("Successfully added to your Wishlist", { id: "wishlist" });
    } catch (error) {
      toast.error(error?.message || "Verification failed", { id: "wishlist" });
    }
  };

  if (isLoading) return <StyleCardSkeleton />;

  return (
    <div className="cursor-pointer w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all">
      <Card
        className="relative w-full overflow-hidden rounded-2xl group p-0"
        onClick={onClick}
      >
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddWishlist?.(id);
          }}
          className="absolute top-3 right-3 z-20 p-1 md:p-1.5 rounded-full 
                     bg-white backdrop-blur-sm text-primary 
                     opacity-100 md:opacity-0 md:group-hover:opacity-100 
                     transition-opacity duration-300 hover:bg-secondary hover:text-white"
        >
          <Heart className="w-2 h-2 md:w-4 md:h-4" />
        </button>

        {/* Category Badge */}
        <span
          className="absolute top-3 left-3 z-20 px-2 md:px-3 py-[2px] md:py-1 rounded-full 
                     text-[8px] md:text-xs font-medium tracking-wide 
                     bg-white backdrop-blur-md text-primary shadow-md
                     opacity-100 md:opacity-0 md:group-hover:opacity-100 
                     transition-opacity duration-300"
        >
          {category}
        </span>

        {/* Image */}
        <img
          src={img_src}
          alt={title}
          className="w-full h-auto object-cover"
          loading="lazy"
        />

        {/* Bottom gradient + title */}
        <div
          className="absolute bottom-0 left-0 w-full p-4 
                     opacity-100 md:opacity-0 md:group-hover:opacity-100 
                     transition-opacity duration-300 ease-in-out"
        >
          <div
            className="absolute inset-x-0 bottom-0 h-20 
                       bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          />
          <CardTitle className="relative z-10 text-[8px] md:text-lg font-semibold text-white">
            {title}
          </CardTitle>
        </div>
      </Card>
    </div>
  );
};

export default StyleCard;
