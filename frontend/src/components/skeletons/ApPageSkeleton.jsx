import React from "react";
import AppointmentCardSkeleton from "./ApCardSkeleton";

const AppointmentsSkeleton = () => {
  return (
    <div className="mx-4 sm:mx-8 lg:mx-[5%] my-6 min-h-screen">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <AppointmentCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default AppointmentsSkeleton;
