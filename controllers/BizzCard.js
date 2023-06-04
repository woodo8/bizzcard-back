import mongoose from "mongoose";
import { BizzCard, validateCard } from "../models/bizzCardSchema.js";

export const createNewCard = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {

        // Find the user by the id in params
        const { id: id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id")


        // Create the new Card
        let newCard = {
            ...req.body,
            owner: id,
        };

        // Add images to the database
        if (req.files['profile_img']) {
            newCard.profile_img = req.files['profile_img'][0].path;
            console.log(req.files['profile_img'][0])
        }
        if (req.files['background_img']) {
            newCard.background_img = req.files['background_img'][0].path;
        }


        // Validate errors
        const { error } = validateCard(newCard);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Save the new card in the database
        newCard = await new BizzCard(newCard);
        await newCard.save();
        return res.status(200).json(newCard);
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export const getMyCards = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {
        const { id: id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No user with that id")


        const myCards = await BizzCard.find({ owner: id });

        let newArr = [...myCards]
        let sortedArray = newArr.sort(function (a, b) {
            // @ts-ignore
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        return res.status(200).json(sortedArray);

    } catch (error) {
        return res.status(400).send(error.message)
    }

}

export const getAllCards = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {
        const cards = await BizzCard.find({});
        let newArr = [...cards]
        let sortedArray = newArr.sort(function (a, b) {
            // @ts-ignore
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        return res.status(200).json(sortedArray);

    } catch (error) {
        return res.status(400).send(error.message)
    }
}

export const getCard = async (req, res) => {
    // #swagger.tags = ['Cards']

    try {
        const { id: id } = req.params;
        const card = await BizzCard.findById(id);

        // Check if the user id is valid
        if (!card) {
            return res.status(400).send("Card not found");
        }
        return res.status(200).json(card);

    } catch (error) {
        return res.status(400).send(error.message)
    }

}
export const editCard = async (req, res) => {
    // #swagger.tags = ['Cards']

    try {
        const { userId: userId, cardId: cardId } = req.params;

        let cardinfos = { ...req.body };
        if (!mongoose.Types.ObjectId.isValid(cardId)) return res.status(404).send("No card with that id");

        // Add images to the database
        if (req.files['profile_img']) {
            cardinfos.profile_img = req.files['profile_img'][0].filename;
        }
        if (req.files['background_img']) {
            cardinfos.background_img = req.files['background_img'][0].filename;
        }
        const updatedCard = await BizzCard.findOneAndUpdate({ _id: cardId, owner: userId }, { ...cardinfos, updatedAt: Date.now(), cardId }, { new: true });
        if (!updatedCard) {
            return res.status(404).send("Card not found");
        }
        return res.status(200).json(updatedCard);
    } catch (err) {
        return res.status(401).send(err.message);
    }
}
export const deleteCard = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {
        const { userId: userId, cardId: cardId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cardId)) return res.status(404).send("No card with that id");

        await BizzCard.findOneAndDelete({ _id: cardId, owner: userId });
        return res.status(200).send("Deleted successfully");
    } catch (err) {
        return res.status(401).send(err.message);
    }

}