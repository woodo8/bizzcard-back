import express from "express";
import { signin, signup, verifyEmail } from "../controllers/authRoutes.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/verify-email", verifyEmail);


export default router;