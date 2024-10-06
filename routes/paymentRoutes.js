import express from "express";
import auth from "../middleware/auth.js";
import dotenv from "dotenv"
import { createNewPaymentCard, updatePaymentCardVerificationByToken } from "../controllers/paymentConotroller.js";

dotenv.config();
const router = express.Router();

router.post("/create_payment_card/:ownerId", auth, createNewPaymentCard);
router.post("/set_verify_to_true/", auth, updatePaymentCardVerificationByToken);

export default router;