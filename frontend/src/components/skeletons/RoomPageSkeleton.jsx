// RoomsPageSkeleton.tsx
import { motion } from "framer-motion"
import { RoomCardSkeleton } from "./RoomCardSkeleton"

export function RoomsPageSkeleton() {
  return (
    <div className="mx-4 sm:mx-[5%] md:mx-[2%] my-10">
      <div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-h-screen"
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
          >
            <RoomCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}
