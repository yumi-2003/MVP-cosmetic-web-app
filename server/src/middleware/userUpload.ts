import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "user_profiles",
      format: "png",
      public_id: Date.now().toString(),
    };
  },
});

const parser = multer({ storage });

export default parser;
