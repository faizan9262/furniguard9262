import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoDBConnect from "./config/mongodb.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/products.route.js";
import conntectCloadinary from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import designerRouter from "./routes/designer.route.js";
import appointmentRouter from "./routes/appointment.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import ratingRouter from "./routes/rating.route.js";
import { createServer } from "http";
import { initSocket } from "./socket/socket.js";
import messageRouter from "./routes/message.route.js";
import Razorpay from "razorpay";
import paymentRouter from "./routes/payment.routes.js";
import helmet from "helmet";
import { authLimiter } from "./utils/limiter.js";
import logger from "./utils/logger.js";

dotenv.config();

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const app = express();
const httpServer = createServer(app);
const allowedOrigins = [
  "http://localhost:5173",
  "https://68ae96cba0d8f96292b37316--aquamarine-treacle-a13a6c.netlify.app",
  "http://localhost:5174",
  // Add your production frontend URL here later
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
await mongoDBConnect();
conntectCloadinary();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(authLimiter);

app.get("/", (req, res) => {
  res.send("Welcome to Furniguard APIs");
});

initSocket(httpServer);

app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/designers", designerRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/message", messageRouter);
app.use("/api/payment", paymentRouter);

const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});


