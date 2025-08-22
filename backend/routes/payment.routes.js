import express from "express";
import { checkOut, getAllPaymentList, getKey, paymentVerification } from "../controllers/payment.controller.js";
import { verifyToken } from "../utils/token-manager.js";
import adminAuth from "../middleware/adminAuth.js";

const paymentRouter = express.Router();

paymentRouter.post("/checkout",verifyToken,checkOut)
paymentRouter.post("/verification",verifyToken,paymentVerification)
paymentRouter.get("/get-key",verifyToken,getKey)
paymentRouter.get("/all-payments",adminAuth,getAllPaymentList)

export default paymentRouter;