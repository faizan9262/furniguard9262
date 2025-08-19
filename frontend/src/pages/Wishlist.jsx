import React, { useEffect, useState } from "react";
import {
  getAllWishlistProducts,
  removeFromWishlist,
} from "../helper/api-communicator.js";
import WishlistCard from "@/components/WishlistCard.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/components/ui/button.jsx";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useStyle } from "../context/StyleContext.jsx";

const Wishlist = () => {
  const style = useStyle() 
  const navigate = useNavigate();


  const handleRemoveFromWishlist = async (productId) => {
    try {
      toast.loading("Removing from wishlist", { id: "wishlist" });
      await removeFromWishlist(productId);
      style?.setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item._id !== productId)
      );
      toast.success("Product removed from wishlist.", { id: "wishlist" });
    } catch (error) {
      toast.error(error?.message || "Removal failed", { id: "wishlist" });
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Your Wishlist
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage the styles you've saved.
          </p>
        </div>

        {/* Add More Button */}
        <Button
          onClick={() => navigate("/styles")}
          className="w-full hidden md:flex sm:w-auto items-center gap-1 font-semibold px-5 py-2 rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-200"
        >
          <Plus className="w-4 h-4" />
          Add More
        </Button>
      </div>

      {style?.wishlist.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          <p className="text-sm">No Styles in Your wishlist</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {style?.wishlist.map((w) => (
            <motion.div
              key={w._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <WishlistCard
                title={w.name}
                description={w.description}
                img_src={w.image}
                price={w.price}
                category={w.category}
                onView={() => navigate(`/styles/${w.category}/${w._id}`)}
                onRemove={() => handleRemoveFromWishlist(w._id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;
