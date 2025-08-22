import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies["admin_cookie"];
    console.log("Admin token from cookie:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token data to req and res.locals
    req.admin = decoded;
    res.locals.jwtData = decoded;

    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);

    return res.status(401).json({
      success: false,
      message:
        error.name === "JsonWebTokenError"
          ? "Invalid token"
          : error.name === "TokenExpiredError"
          ? "Session expired. Please log in again."
          : "Unauthorized access",
    });
  }
};

export default adminAuth;
