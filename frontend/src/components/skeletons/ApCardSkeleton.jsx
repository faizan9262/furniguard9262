import React from "react";
import { Skeleton } from "../components/ui/skeleton";
import { Card, CardContent } from "../components/ui/card";

const AppointmentCardSkeleton = () => {
  return (
    <Card className="group flex items-start gap-6 p-4 sm:p-3 rounded-3xl">
      {/* Left Side - Product Preview */}
      <div className="w-full gap-4 flex flex-col">
        <Skeleton className="w-full h-52 rounded-xl bg-primary/20" /> {/* Image */}
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-6 w-32 rounded bg-secondary/80" /> {/* Product Name */}
          <Skeleton className="h-5 w-20 rounded bg-secondary/80" /> {/* Category */}
        </div>
      </div>

      {/* Right Side Content */}
      <CardContent className="flex-1 w-full flex flex-col gap-4">
        {/* Top Row - Date + Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
          <div className="flex w-full flex-col gap-2">
            <div className="flex md:flex-col gap-2">
              <Skeleton className="h-5 w-28 rounded bg-primary/80" /> {/* Date Badge */}
              <Skeleton className="h-5 w-24 rounded-full bg-primary/80" /> {/* Status */}
            </div>
          </div>
        </div>

        {/* Bottom Row - User & Designer */}
        <div className="flex justify-between">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full bg-primary/20" />
          </div>

          {/* Designer Info */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full bg-primary/20" /> 
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCardSkeleton;
