import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { createPortfolio, deletePortfolio, edit_portfolio, get_portfolio } from "../controllers/portfolioController.js";
import auth from "../middleware/auth.js";
// import uploadAny from "../middleware/multerFileuploadAny.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        // cloudinary, // this searches in .env for something called CLOUDINARY_URL which contains your API Environment variable
        cloudinary,
        params: {
            api_key: "829638828127188",
            api_secret: "01XaMR-rMYaoCv9Hb_dkFhsSFXU",
            cloud_name: "dacffwhln",
            folder: "portfolioImages",
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
// routes for bizzcard
router.post("/create_portfolio/:id",
    auth,
    cloudinaryUploader.single("image"),
    createPortfolio);
router.get("/get_portfolio/:id", get_portfolio);
router.patch("/edit_portfolio/:portfolioId", auth, cloudinaryUploader.single("image"), edit_portfolio);
router.delete("/remove_portfolio/:portfolioId", auth, deletePortfolio);


export default router;