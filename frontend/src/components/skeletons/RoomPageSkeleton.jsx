// RoomsPageSkeleton.tsx
import { motion } from "framer-motion"
import { RoomCardSkeleton } from "./RoomCardSkeleton"

export function RoomsPageSkeleton() {
  return (
    <div className="mx-4 sm:mx-[5%] md:mx-[2%] my-10">
      <motion.div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-h-screen"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <RoomCardSkeleton />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
