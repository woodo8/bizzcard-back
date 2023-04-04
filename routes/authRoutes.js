import express from "express";
import { forgotPassword, signin, signup, verifyEmail, resetPassword } from "../controllers/authRoutes.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/verify-email", verifyEmail);
router.post("/forgot_password", forgotPassword);
router.patch("/reset_password", auth, resetPassword)

export default router;