import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import {
  CloudinaryStorage,
  Options as CloudinaryStorageOptions,
} from "multer-storage-cloudinary";

// cloudinary config
const config: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
};
cloudinary.config(config);

// storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ShelterWebsite",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
} as CloudinaryStorageOptions);

export { cloudinary, storage };
