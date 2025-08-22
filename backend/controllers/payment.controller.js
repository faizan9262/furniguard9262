import { razorpayInstance } from "../index.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.model.js";
import { Appointment } from "../models/Appointment.model.js";

export const checkOut = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json(order);

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};

export const paymentVerification = async (req, res) => {
  try {
    const {
      appointmentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;


    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (!isAuthentic) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointment: appointmentId,
    });

    await Appointment.findByIdAndUpdate(appointmentId, {
      status: "confirmed",
    });

    return res.status(200).json({
      success: true,
      reference: razorpay_payment_id,
      appointment:appointmentId
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPaymentList = async (req, res) => {
  try {
    const list = await Payment.find()
      .populate({
        path: "appointment",
        populate: [
          {
            path: "user",
            model: "UserModel",
            select: "username email profilePicture", // only needed fields
          },
          {
            path: "designer",
            select: "user type", // limit designer fields if needed
            populate: {
              path: "user",
              model: "UserModel",
              select: "username email profilePicture",
            },
          },
          {
            path: "products", // full product docs
            // you can also do select: "name price" if you only want some fields
          },
        ],
      })
      .sort({ createdAt: -1 });
      
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

