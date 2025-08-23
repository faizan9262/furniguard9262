import { v2 as cloudinary } from "cloudinary";
import { Style } from "../models/styles.model.js";
import { Rating } from "../models/rating.model.js";
import mongoose from "mongoose";

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
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const listProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;

    const categories = await Style.distinct("category"); // get all categories
    const limitPerCategory = Math.ceil(limit / categories.length);

    let products = [];

    for (const cat of categories) {
      const catProducts = await Style.find({ category: cat })
        .skip((page - 1) * limitPerCategory)
        .limit(limitPerCategory)
        .lean();
      products.push(...catProducts);
    }

    products = products.sort(() => Math.random() - 0.5);
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

    const statsMap = {};
    stats.forEach((stat) => {
      statsMap[stat._id.toString()] = stat;
    });

    const ratedProducts = products.map((product) => ({
      ...product,
      averageRating: statsMap[product._id.toString()]?.averageRating || 0,
      totalRatings: statsMap[product._id.toString()]?.totalRatings || 0,
    }));

    res.status(200).json({ success: true, ratedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while fetching products details.",
    });
  }
};

export const getHomeProducts = async (req, res) => {
  try {
    const { categories, limit } = req.query;

    if (!categories) {
      return res
        .status(400)
        .json({ success: false, message: "Categories are required" });
    }

    const categoryList = categories.split(",");
    const limitPerCategory = limit ? parseInt(limit) : 0; // 0 means no limit

    // Fetch products for each category
    const results = await Promise.all(
      categoryList.map(async (category) => {
        const query = Style.find({ category }).lean();
        if (limitPerCategory > 0) query.limit(limitPerCategory);
        return query;
      })
    );

    // Flatten the nested arrays into a single array
    const flattenedResults = results.flat();

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
    console.log(error);
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
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addProduct, listProducts, removeProduct, signleProduct, updateStyles };
