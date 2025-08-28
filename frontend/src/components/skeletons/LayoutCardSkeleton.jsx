import { Skeleton } from "../components/ui/skeleton";

const LayoutCardSkeleton = () => {
  return (
    <div className="relative flex flex-col sm:flex-row overflow-hidden rounded-3xl group">
      {/* Left Side (Image Skeleton) */}
      <div className="relative w-full h-60 sm:h-auto sm:w-2/5">
        <Skeleton className="absolute inset-0 w-full h-full object-cover rounded-3xl sm:rounded-none sm:rounded-l-3xl bg-primary/20" />
      </div>

      {/* Right Side (Content Skeleton) */}
      <div className="relative w-full sm:w-3/5 px-6 sm:px-10 py-6 sm:py-10 bg-white border border-muted shadow-sm flex flex-col justify-between rounded-b-3xl sm:rounded-b-none sm:rounded-r-3xl">
        {/* Title */}
        <Skeleton className="h-5 w-2/3 mb-4 bg-secondary/80" />

        {/* Badge */}
        <Skeleton className="h-6 w-20 rounded-full mb-4 bg-primary/20" />

        {/* Duration */}
        <Skeleton className="h-4 w-1/3 mb-3 bg-secondary/20" />

        {/* Description lines */}
        <Skeleton className="h-3 w-full mb-2 bg-primary/80" />
        <Skeleton className="h-3 w-5/6 mb-2 bg-primary/80" />
        <Skeleton className="h-3 w-2/3 bg-primary/80" />

        {/* Decorative Corner Placeholder */}
        <div className="absolute bottom-3 right-3 w-8 h-8 bg-muted/20 rotate-45 rounded-lg" />
      </div>
    </div>
  );
};

export default LayoutCardSkeleton;
