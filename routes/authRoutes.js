import express from "express";
import { editProfile, signin, signup, userInfos, verifyEmail } from "../controllers/authRoutes.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/profile/:id", auth, userInfos);
router.patch("/edit_profile/:id", auth, editProfile);
router.get("/verify-email", verifyEmail);

export default router;