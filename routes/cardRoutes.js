import express from "express";
import { createNewCard, deleteCard, editCard, getAllCards, getCard, getMyCards } from "../controllers/BizzCard.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multerFileUpload.js";

const router = express.Router();

// routes for bizzcard
router.post("/create_card/:id",
    auth,
    upload.fields([
        { name: 'profile_img', maxCount: 1 },
        { name: 'background_img', maxCount: 1 },
        { name: 'page_bg', maxCount: 1 },
    ]),
    createNewCard);

router.get("/get_card/:id", getCard);
router.get("/get_all_cards/", getAllCards)
router.get("/get_my_cards/:id", auth, getMyCards);

router.patch("/edit_card/:userId/:cardId",
    auth,
    upload.fields([
        { name: 'profile_img', maxCount: 1 },
        { name: 'background_img', maxCount: 1 },
        { name: 'page_bg', maxCount: 1 },
    ]),
    editCard);
router.delete("/remove_card/:userId/:cardId", auth, deleteCard);

export default router;