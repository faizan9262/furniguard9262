// WishlistPageSkeleton.tsx
import React from "react";
import { Skeleton } from "../components/components/ui/skeleton";

export const WishlistPageSkeleton = ({ count = 8 }) => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6">
      {/* Title Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Skeleton className="w-48 h-6 rounded-lg" /> {/* Title */}
        <Skeleton className="w-32 h-10 rounded-lg hidden md:block" /> {/* Add More Button */}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white max-w-md border shadow-lg rounded-xl overflow-hidden flex flex-col animate-pulse"
          >
            {/* Header Strip */}
            <div className="w-full bg-primary px-4 py-2 text-white text-sm font-medium flex justify-between items-center">
              <Skeleton className="w-24 h-4 rounded-lg bg-secondary" /> {/* Title */}
              <Skeleton className="w-12 h-4 rounded-full bg-secondary" /> {/* Category Badge */}
            </div>

            {/* Main Content */}
            <div className="flex flex-col sm:flex-row gap-4 p-3">
              <div className="w-full flex justify-center">
                <Skeleton className="w-60 h-64 rounded-lg border bg-primary/20" /> {/* Centered Image */}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-2 px-4 pb-4">
              <Skeleton className="flex-1 h-10 rounded-lg bg-primary/20" /> {/* View Button */}
              <Skeleton className="flex-1 h-10 rounded-lg bg-primary" /> {/* Remove Button */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
