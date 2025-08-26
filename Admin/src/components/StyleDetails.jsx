import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { FaStar } from "react-icons/fa";
import { Card, CardContent } from "@/components/components/ui/card";
import { Badge } from "@/components/components/ui/badge";
import { motion } from "framer-motion";
import { Edit2Icon, Star } from "lucide-react";
import { toast } from "sonner";
import { getProductRating } from "../helper/apis.js";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { FaWandMagicSparkles } from "react-icons/fa6";

const StyleDetails = () => {
  const { id } = useParams();
  const product = useAdmin();
  const navigate = useNavigate();

  // All hooks are called at the top, unconditionally
  const [rating, setRating] = useState([]);
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeImage, setActiveImage] = useState(null);

  const products = product?.list?.find((p) => p._id === id);
  const relatedProducts = product?.list?.filter(
    (p) => p._id !== products?._id && p.category === products?.category
  );

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(2);
      else if (width < 1024) setVisibleCount(3);
      else setVisibleCount(4);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    if (!products) return;
    setActiveImage(
      products?.image
    );
  }, [products]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await getProductRating(id);
        setRating(data.data);
      } catch (err) {
        toast.error("Failed to load product rating");
      }
    };
    fetchRating();
  }, [id]);

  if (!products) {
    return <div className="text-center py-10">Product not found</div>;
  }

  const roundedRating = Math.round(products.averageRating || 0);

  return (
    <div className="px-4 py-10 sm:px-[5%] bg-gradient-to-br from-[#faf5ef] to-[#ebdec8] min-h-screen">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Image Slider */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Large Image */}
          <div className="aspect-[4/3] max-h-[400px] w-full rounded-xl overflow-hidden shadow-xl">
            <img
              src={activeImage}
              alt="Main Preview"
              className="w-full h-full object-contain sm:object-cover"
            />
          </div>

        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
              {products.name}
            </h1>
            <Button onClick={()=> navigate(`/edit-style/${products.category}/${id}`)} className="bg-primary text-white transition-all duration-300"><FaWandMagicSparkles />Update Styles</Button>
          </div>

          {/* Rating */}
          <div className="flex flex-wrap items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < roundedRating ? "text-yellow-400" : "text-gray-300"
                }
              />
            ))}
            {products.totalRatings > 0 ? (
              <span className="text-sm text-gray-500">
                ({products.totalRatings} Rating
                {products.totalRatings > 1 ? "s" : ""})
              </span>
            ) : (
              <span className="text-sm text-gray-400">No ratings</span>
            )}
          </div>

          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            {products.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {["Eco-Friendly", "Durable", "Customizable"].map((label) => (
              <Badge
                key={label}
                variant="outline"
                className="bg-primary/20 text-primary border-none"
              >
                {label}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Creative Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-20 rounded-xl bg-[#f4ede2] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6"
      >
        <div className="space-y-3 max-w-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-secondary">
            Trusted by Interior Designers & Homeowners Alike
          </h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Over 10,000+ homes enhanced with our elegant products. Explore
            premium craftsmanship and unique designs tailored to your
            lifestyle.
          </p>
        </div>
        <img
          src={activeImage}
          alt="creative-preview"
          className="w-40 h-40 sm:w-60 sm:h-60 object-cover rounded-xl shadow-md"
        />
      </motion.div>

      {/* Ratings */}
      <section className="space-y-6 mt-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(rating) &&
            rating
              .slice(0, showAllRatings ? rating.length : visibleCount)
              .map((t, i) => (
                <Card
                  key={i}
                  className="p-4 bg-primary/10 shadow-md hover:shadow-lg transition-shadow border-0 rounded-2xl"
                >
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 italic text-sm line-clamp-4">
                      “{t.reviewText}”
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={t.userId.profilePicture} />
                        <AvatarFallback>
                          {t.userId.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-muted text-sm">
                          {t.userId.username}
                        </span>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= t.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill={star <= t.rating ? "#facc15" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
        {!showAllRatings && rating.length > visibleCount && (
          <div className="text-center">
            <Button variant="outline" onClick={() => setShowAllRatings(true)}>
              View All Ratings
            </Button>
          </div>
        )}
      </section>

    </div>
  );
};

export default StyleDetails;
