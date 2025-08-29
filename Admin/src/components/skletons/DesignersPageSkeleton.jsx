import { Skeleton } from "../components/ui/skeleton"

export default function DesignersPageSkeleton() {
  return (
    <div className="mx-4 sm:mx-[10%] h-full my-8">
      <div className="mt-10">
        {/* Header */}
        <div className="flex gap-2 items-center">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>

        {/* Search + Filter */}
        <div className="w-full flex justify-between items-center gap-4 my-6">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-52 rounded-md" />
        </div>

        {/* Desktop Table Skeleton */}
        <div className="hidden md:block overflow-auto rounded-xl border border-muted bg-white shadow-sm">
          <div className="grid grid-cols-6 gap-4 p-4 border-b">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-24" />
            ))}
          </div>
          <div className="divide-y">
            {[...Array(6)].map((_, row) => (
              <div
                key={row}
                className="grid grid-cols-6 gap-4 p-4 items-center"
              >
                <div className="flex gap-2 items-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="md:hidden flex flex-col gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border-l-[10px] border-primary border bg-white shadow-sm flex justify-between items-start"
            >
              <div className="space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
              </div>
              <Skeleton className="w-8 h-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
