import { motion } from "framer-motion"
import LayoutCardSkeleton from "./LayoutCardSkeleton"

export function LayoutsPageSkeleton() {
  return (
    <div className="my-10 mx-4 sm:mx-[5%] md:mx-[2%]">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 sm:gap-4 min-h-screen"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <LayoutCardSkeleton />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
