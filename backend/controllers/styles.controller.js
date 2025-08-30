import { v2 as cloudinary } from "cloudinary";
import { Style } from "../models/styles.model.js";
import { Rating } from "../models/rating.model.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import redis from "../config/redisClient.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // ⛳ Cloudinary middleware attaches this
    const imageUrls = req.file?.path;

    if (!imageUrls || !imageUrls.length) {
      return res.json({
        success: false,
        message: "Image upload failed or no images provided",
      });
    }

    const productData = {
      name,
      description,
      category,
      image: imageUrls, // ⬅ Store array of URLs
    };

    const product = new Style(productData);
    await product.save();

    return res.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateStyles = async (req, res) => {
  try {
    const { id } = req.body;

    // Find product
    let product = await Style.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imageUrl = req.file?.path || product.image;

    // Merge updated data
    const updatedData = {
      name: req.body.name ?? product.name,
      description: req.body.description ?? product.description,
      category: req.body.category ?? product.category,
      image: imageUrl ?? product.image,
    };

    // Save updates
    product = await Style.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(product);
  } catch (error) {
    logger.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const limit = 20;
    const page = parseInt(req.query.page) || 1;
    const exclude = req.query.exclude ? req.query.exclude.split(",") : [];

    const cacheKey = `products:page:${page}:exclude:${exclude.join(",")}`;

    // 🔹 Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        ratedProducts: JSON.parse(cachedData),
        cached: true,
      });
    }

    const products = await Style.aggregate([
      { $match: { _id: { $nin: exclude.map(id => new mongoose.Types.ObjectId(id)) } } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const productIds = products.map((p) => p._id);
    const stats = await Rating.aggregate([
      { $match: { targetType: "style", targetId: { $in: productIds } } },
      {
        $group: {
          _id: "$targetId",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const statsMap = Object.fromEntries(stats.map((s) => [s._id.toString(), s]));
    const ratedProducts = products.map((p) => ({
      ...p,
      averageRating: statsMap[p._id.toString()]?.averageRating || 0,
      totalRatings: statsMap[p._id.toString()]?.totalRatings || 0,
    }));

    // 🔹 Save in Redis (TTL: 2 min)
    await redis.setex(cacheKey, 120, JSON.stringify(ratedProducts));

    res.status(200).json({ success: true, ratedProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products." });
  }
};


const getHomeProducts = async (req, res) => {
  try {
    const { categories, limit } = req.query;

    if (!categories) {
      return res
        .status(400)
        .json({ success: false, message: "Categories are required" });
    }

    const categoryList = categories.split(",");
    const limitPerCategory = limit ? parseInt(limit) : 10;

    const cacheKey = `homeProducts:${categoryList.join(",")}:limit:${limitPerCategory}`;

    // 🔹 Check cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedData),
        cached: true,
      });
    }

    // 🔹 Query MongoDB if cache miss
    const results = await Promise.all(
      categoryList.map((category) =>
        Style.find({ category }, "_id name image description")
          .sort({ createdAt: -1 })
          .limit(limitPerCategory)
          .lean()
      )
    );

    const flattenedResults = results.flat();

    // 🔹 Save in Redis (TTL: 5 min)
    await redis.setex(cacheKey, 300, JSON.stringify(flattenedResults));

    res.status(200).json({
      success: true,
      data: flattenedResults,
    });
  } catch (error) {
    console.error("Error fetching home products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const removeProduct = async (req, res) => {
  try {
    await Style.findByIdAndDelete(req.body.id);
    res.json({
      success: true,
      message: "Product Removed",
    });
  } catch (error) {
    logger.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const signleProduct = async (req, res) => {
  try {
    const singleProduct = await Style.findById(req.body.id);

    res.json({
      success: true,
      singleProduct,
    });
  } catch (error) {
    logger.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addProduct, listProducts, removeProduct, signleProduct, updateStyles,getHomeProducts };
