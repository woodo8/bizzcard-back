import express from "express";
import { editProfile, userInfos } from "../controllers/userRoutes.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/profile/:id", auth, userInfos);
router.patch("/edit_profile/:id", auth, editProfile);

export default router;