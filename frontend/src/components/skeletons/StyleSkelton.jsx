import React from "react";
import { Skeleton } from "../components/ui/skeleton"; // shadcn skeleton
import Masonry from "react-masonry-css";

const StylesSkeleton = () => {
  const breakpointColumnsObj = {
    default: 4,
    1400: 4,
    992: 3,
    600: 2,
  };

  // 🔹 Predefined random heights to simulate masonry
  const heights = ["h-40", "h-56", "h-64", "h-72", "h-80"];

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 bg-gradient-to-br from-white via-[#fdf7f0] to-[#fff5e6]">
      {/* 🔹 Filters Skeleton */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 w-full">
        {/* Search bar skeleton */}
        <Skeleton className="h-10 w-full sm:w-1/2 shimmer rounded-lg" />

        {/* Select dropdown skeleton */}
        <Skeleton className="h-10 w-[200px] shimmer rounded-lg" />
      </div>

      {/* 🔹 Masonry Skeleton */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-2 md:gap-4"
        columnClassName="space-y-2 md:space-y-4"
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const randomHeight = heights[Math.floor(Math.random() * heights.length)];
          return (
            <div key={i} className="break-inside-avoid relative w-full overflow-hidden rounded-2xl shadow-lg">
              {/* Variable-height image skeleton */}
              <div className={`w-full ${randomHeight} shimmer rounded-2xl`} />

              {/* Top-left category badge */}
              <div className="absolute top-3 left-3 h-4 w-16 shimmer rounded-full" />

              {/* Top-right wishlist button */}
              <div className="absolute top-3 right-3 h-8 w-8 shimmer rounded-full" />
            </div>
          );
        })}
      </Masonry>
    </div>
  );
};

export default StylesSkeleton;
