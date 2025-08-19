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
    const products = await Style.find({});

    const ratedProducts = await Promise.all(
      products.map(async (product) => {
        const stats = await Rating.aggregate([
          {
            $match: {
              targetType: "style",
              targetId: new mongoose.Types.ObjectId(product._id),
            },
          },
          {
            $group: {
              _id: "$targetId",
              averageRating: { $avg: "$rating" },
              totalRatings: { $sum: 1 },
            },
          },
        ]);
        return {
          ...product.toObject(),
          averageRating: stats[0]?.averageRating || 0,
          totalRatings: stats[0]?.totalRatings || 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      ratedProducts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while fetching products details.",
    });
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
