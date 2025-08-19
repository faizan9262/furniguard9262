import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import { addProduct, listProducts, removeProduct, signleProduct, updateStyles } from '../controllers/styles.controller.js'
import upload from '../middleware/multer.js'
import { uploadToCloudinary } from "../middleware/multer.js";

const productRouter = express.Router()


productRouter.post(
  "/add",
  adminAuth,
  upload.single("product_img"),
  uploadToCloudinary("Melodify"), 
  addProduct
);

productRouter.post('/remove',adminAuth,removeProduct)
productRouter.put(
  "/update",
  upload.single("image"),        
  uploadToCloudinary("Melodify"), 
  updateStyles
);
productRouter.get('/list',listProducts)
productRouter.get('/single',signleProduct)

export default productRouter;