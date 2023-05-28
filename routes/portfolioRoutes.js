import express from "express";
import { createPortfolio } from "../controllers/portfolioController.js";
import auth from "../middleware/auth.js";
import uploadAny from "../middleware/multerFileuploadAny.js";

const router = express.Router();

// routes for bizzcard
router.post("/create_portfolio/:id",
    auth,
    uploadAny.fields([
        { name: 'file', maxCount: 1 },
        { name: 'image', maxCount: 1 },
    ]),
    createPortfolio);

export default router;