import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStyle } from "../context/StyleContext";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { Card, CardContent } from "@/components/components/ui/card";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { addToWishlist, getProductRating } from "../helper/api-communicator";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { useAuth } from "../context/AuthContext";

const StyleDetail = () => {
  const { id } = useParams();
  const product = useStyle();
  const navigate = useNavigate();
  const [rating, setRating] = useState({});

  const [showAllRatings, setShowAllRatings] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const auth = useAuth();
  const isDesigner = auth.user.role === "designer";

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

  const products = product.products.find((p) => p._id === id) || product.livingroom.find((p)=> p._id == id) || product.stairs.find((p)=> p._id == id) || product.layout.find((p)=> p._id == id)  ;
  console.log("Products: ",products);
  
  const relatedProducts = product.products.filter(
    (p) => p.category === products.category
  );

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await getProductRating(id);
        setRating(data.data.map((d) => d));
      } catch (err) {
        console.error("Failed to load product rating:", err.message);
      }
    };
    fetchRating();
  }, [id]);

  if (!products) {
    return <div>Style not found</div>;
  }

  const handleAddWishlist = async (productId) => {
    try {
      toast.loading("Adding to Wishlist", { id: "p-details" });
      const data = await addToWishlist(productId);
      console.log("Data: ", data);
      toast.success("Successfully added to your Wishlist", { id: "p-details" });
    } catch (error) {
      toast.error(error?.message || "Verification failed", { id: "p-details" });
    }
  };

  const roundedRating = Math.round(products.averageRating || 0);

  return (
    <div className="px-4 py-10 sm:px-[5%] bg-gradient-to-br from-[#faf6ef] to-[#ebd8c8] min-h-screen">
      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Image Slider */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="aspect-[4/3] max-h-[400px] w-full rounded-xl overflow-hidden shadow-xl">
            <img
              src={products.image}
              alt={products.name}
              className="w-full h-full object-cover"
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
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            {products.name}
          </h1>
          <div className="flex items-center gap-2">
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
          <p className="text-md ms:text-lg text-gray-700 leading-relaxed">
            {products.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/20">
              Eco-Friendly
            </Badge>
            <Badge variant="outline" className="bg-primary/20">
              Durable
            </Badge>
            <Badge variant="outline" className="bg-primary/20">
              Customizable
            </Badge>
          </div>


          {!isDesigner && (
            <div className="flex flex-row gap-3 sm:items-center sm:justify-start mt-4">
              {/* Consult Now Button */}
              <Button
                onClick={() =>
                  navigate("/new-appointment", {
                    state: {
                      category: products.category,
                      productId: products._id,
                    },
                  })
                }
                className="bg-primary w-full flex-1 hover:bg-secondary text-white rounded-xl px-6 py-2 text-lg shadow-md transition-transform hover:scale-[1.02]"
              >
                Consult Now <FaArrowRight className="ml-2" />
              </Button>

              {/* Add to Wishlist Button */}
              <Button
                variant="outline"
                className="border-white bg-green-500 border-2 text-white hover:bg-green-600 rounded-xl px-5 py-2 text-sm sm:text-base font-medium flex items-center gap-2 shadow-xl transition-all duration-200"
                onClick={() => handleAddWishlist(products._id)}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden md:block">Save to Wishlist</span>
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Creative Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-20 rounded-xl bg-[#f5ece2] p-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left"
      >
        <div className="space-y-3 max-w-xl">
          <h3 className="text-2xl font-bold text-primary">
            Trusted by Interior Designers & Homeowners Alike
          </h3>
          <p className="text-gray-700">
            Over 10,000+ homes enhanced with our elegant products. Explore
            premium craftsmanship and unique designs tailored to your lifestyle.
          </p>
        </div>
        <img
          src={products.image}
          alt="creative-preview"
          className="w-60 h-60 object-cover rounded-xl mt-6 md:mt-0 shadow-md"
        />
      </motion.div>

      <section className="space-y-6 mt-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(rating) &&
            rating.map((t, i) => (
              <Card
                key={i}
                className="p-4 shadow-md hover:shadow-lg bg-primary/10 transition-shadow border border-muted rounded-2xl"
              >
                <CardContent className="space-y-4">
                  {/* Feedback text */}
                  <p className="text-gray-700 italic text-sm line-clamp-4">
                    “{t.reviewText}”
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    {/* User Avatar */}
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={t.userId.profilePicture} />
                      <AvatarFallback>
                        {t.userId.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Username and Rating */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground">
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

      {/* Related Products */}
      <div className="mt-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
          Similar Styles, Same Wow
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.length > 0 ? relatedProducts?.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-[#e5d9c1] p-4 group"
              onClick={() => navigate(`/styles/${p.category}/${p._id}`)}
            >
              <img
                src={p.image}
                alt=""
                className="w-full h-60 object-cover rounded-xl mb-3"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-secondary">{p.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-4">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-primary/20">{p.category}</Badge>
                </div>
              </div>
            </motion.div>
          )): <p className="text-muted">No Similar Styles</p>}
        </div>
      </div>
    </div>
  );
};

export default StyleDetail;
