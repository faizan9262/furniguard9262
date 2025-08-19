import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.signedCookies["admin-cookie"];
    // console.log("Admin token from cookie:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtData = decoded;


    req.admin = decoded; // You can pass this forward if needed
    next();
  } catch (error) {
    console.log("Admin auth error:", error.message);
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
};

export default adminAuth;
