import { motion } from "framer-motion"
import LayoutCardSkeleton from "./LayoutCardSkeleton"

export function LayoutsPageSkeleton() {
  return (
    <div className="my-10 mx-4 sm:mx-[5%] md:mx-[2%]">
      <div
        className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-4 min-h-screen"
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
          >
            <LayoutCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}
