// DesignerCardSkeleton.tsx
import React from "react";
import { Skeleton } from "../components/ui/skeleton";

export const DesignerCardSkeleton = () => {
  return (
    <div className="group relative w-full rounded-3xl mt-6 overflow-visible shadow-lg bg-primary/20 h-[350px]">
      
      {/* Floating Profile Image */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-primary shadow-md overflow-hidden bg-primary">
        <Skeleton className="w-full h-full rounded-full" />
      </div>

      {/* Card Content */}
      <div className="flex flex-col items-center text-center gap-3 pt-16 px-6">
        {/* Name */}
        <Skeleton className="w-32 h-6 rounded-lg" />

        {/* Badges */}
        <div className="flex gap-2 flex-wrap justify-center mt-2">
          <Skeleton className="w-20 h-5 rounded-full bg-primary" /> {/* Type */}
          <Skeleton className="w-20 h-5 rounded-full bg-primary" /> {/* Experience */}
          <Skeleton className="w-20 h-5 rounded-full bg-primary" /> {/* Designer+3 */}
        </div>

        {/* Joining Date */}
        <Skeleton className="w-48 h-4 rounded-lg mt-3 bg-secondary" />

        {/* Bio */}
        <Skeleton className="w-56 h-12 rounded-lg mt-3 bg-primary/80" />

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 rounded-full bg-secondary" />
          ))}
          <Skeleton className="w-16 h-4 ml-2 rounded-lg bg-primary" />
        </div>
      </div>
    </div>
  );
};
