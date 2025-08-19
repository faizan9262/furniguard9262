import express from "express";
import { checkOut, getKey, paymentVerification } from "../controllers/payment.controller.js";
import { verifyToken } from "../utils/token-manager.js";

const paymentRouter = express.Router();

paymentRouter.post("/checkout",verifyToken,checkOut)
paymentRouter.post("/verification",verifyToken,paymentVerification)
paymentRouter.get("/get-key",verifyToken,getKey)

export default paymentRouter;