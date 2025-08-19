import multer from "multer";
import streamifier from "streamifier";
import pkg from "cloudinary";
const { v2: cloudinary } = pkg;

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .jpg, .jpeg and .png formats are allowed"));
  },
});

export const uploadToCloudinary = (folder = "Melodify") => {
  return async (req, res, next) => {
    try {
      // If no file provided → skip upload and continue
      if (!req.file && !(req.files && req.files.length)) {
        return next();
      }

      // Handle single file
      if (req.file) {
        const stream = streamifier.createReadStream(req.file.buffer);

        const result = await new Promise((resolve, reject) => {
          const cloudinaryStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.pipe(cloudinaryStream);
        });

        req.file.path = result.secure_url; // Pass URL to controller
        return next();
      }

      // Handle multiple files
      if (req.files && req.files.length) {
        const uploadedImages = [];

        for (const file of req.files) {
          const stream = streamifier.createReadStream(file.buffer);

          const result = await new Promise((resolve, reject) => {
            const cloudinaryStream = cloudinary.uploader.upload_stream(
              { folder, resource_type: "image" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.pipe(cloudinaryStream);
          });

          uploadedImages.push(result.secure_url);
        }

        req.images = uploadedImages;
        return next();
      }
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      return res.status(500).json({ message: "Upload error" });
    }
  };
};

export default upload;
