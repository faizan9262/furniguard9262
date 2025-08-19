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
