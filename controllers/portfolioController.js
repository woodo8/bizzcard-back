import mongoose from "mongoose";
// import { BizzCard, validateCard } from "../models/bizzCardSchema.js";
import { Portfolio, validatePortfolio } from "../models/portfolioSchema.js";


export const createPortfolio = async (req, res) => {
    // #swagger.tags = ['Portfolio']
    try {

        // Find the user by the id in params
        const { id: id, } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No card with that id")


        // Create the new Card
        let newPortfolio = {
            ...req.body,
            superCard: id,
        };

        // Add images to the database
        if (req.files['file']) {
            newPortfolio.file = req.files['file'][0].filename;
        }
        if (req.files['image']) {
            newPortfolio.image = req.files['file'][0].filename;
        }

        // Validate errors
        const { error } = validatePortfolio(newPortfolio);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // Save the new card in the database
        newPortfolio = await new Portfolio(newPortfolio);
        await newPortfolio.save();
        return res.status(200).json(newPortfolio);
    } catch (error) {
        return res.status(400).send(error.message)
    }
}