import { Skeleton } from "../components/ui/skeleton"

export default function PaymentsPageSkeleton() {
  return (
    <div className="p-4 sm:p-6">

      {/* Desktop Table Skeleton */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-6 bg-secondary/10 p-3 font-semibold text-sm text-secondary">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-100">
          {[...Array(6)].map((_, row) => (
            <div
              key={row}
              className="grid grid-cols-6 gap-2 p-3 text-sm items-center"
            >
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-full justify-self-end" />
              <Skeleton className="h-4 w-20 justify-self-end" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card Skeletons */}
      <div className="sm:hidden flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-2"
          >
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
