// RoomCardSkeleton.tsx
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"

export function RoomCardSkeleton() {
  return (
    <Card className="group flex flex-col gap-3 cursor-pointer p-4 sm:p-3 rounded-3xl">
      {/* Image placeholder */}
      <Skeleton className="w-full h-80 rounded-xl bg-primary/20" />

      <CardContent className="flex flex-col gap-2 p-0">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 rounded-lg bg-secondary/80" />

        {/* Description */}
        <Skeleton className="h-4 w-full rounded-lg bg-primary/80" />
        <Skeleton className="h-4 w-5/6 rounded-lg bg-primary/80" />
      </CardContent>
    </Card>
  )
}
