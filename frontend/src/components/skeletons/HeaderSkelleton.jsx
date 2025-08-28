import React from "react";
import { Skeleton } from "../components/ui/skeleton";

const HeaderSkeleton = () => {
  return (
    <div className="relative h-screen bg-black/80 flex justify-center items-center overflow-hidden">
      {/* Main content container */}
      <div className="relative flex flex-col gap-6 px-6 sm:px-8 w-full max-w-6xl">
        {/* Heading skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-6 sm:h-8 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-6 sm:h-8 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-6 sm:h-8 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Bullet points skeleton */}
        <div className="flex flex-col gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-4">
              {/* Icon placeholder */}
              <Skeleton className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-800" />
              {/* Text placeholder */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>

        {/* Stats section skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-2 p-4"
            >
              <Skeleton className="h-6 sm:h-8 w-16 rounded bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-3 w-20 sm:w-24 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          ))}
        </div>

        {/* CTA button skeleton */}
        <div className="mt-8">
          <Skeleton className="h-12 w-full sm:w-64 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;
