import express from "express";
import { editProfile, userInfos } from "../controllers/userRoutes.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        // cloudinary, // this searches in .env for something called CLOUDINARY_URL which contains your API Environment variable
        cloudinary,
        params: {
            api_key: "829638828127188",
            api_secret: "01XaMR-rMYaoCv9Hb_dkFhsSFXU",
            cloud_name: "dacffwhln",
            folder: "profileImages",
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif', 'image/apng'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, SVG, AVIF, APNG and WEBP files are allowed.'), false);
        }
    }
})


const router = express.Router();

router.get("/profile/:id", auth, userInfos);
router.patch("/edit_profile/:id", auth, cloudinaryUploader.single("profile_img"), editProfile);

export default router;