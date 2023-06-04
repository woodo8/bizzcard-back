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
        // if (req.files['file']) {
        //     newPortfolio.file = req.files['file'][0].filename;
        // }
        if (req.file) {
            newPortfolio.image = req.file.path;
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
        console.log(error)
        return res.status(400).json(error)
    }
}


export const get_portfolio = async (req, res) => {
    // #swagger.tags = ['Portfolio']

    try {
        const { id: id, } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No portfolio with that id")


        const existingPortfolio = await Portfolio.find({ superCard: id });

        if (!existingPortfolio) {
            return res.status(404).send('Portfolio not found');
        }

        // Check if the user is verified
        return res.status(200).json(existingPortfolio);
    } catch (err) {
        return res.status(401).send(err);
    }
}
export const edit_portfolio = async (req, res) => {
    // #swagger.tags = ['Portfolio']

    try {
        const { portfolioId: id, } = req.params;

        const body = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No portfolio with that id");

        const existingPortfolio = Portfolio.findById(id);

        if (!existingPortfolio) {
            return res.status(404).send("No portfolio with that id");
        }

        for (var key in body) {
            //@ts-ignore
            if (!body[key] || body[key] == "null") {
                delete body[key];
            }
        }

        if (req.file) {
            body.image = req.file.path;
        }

        const updatedPortfolio = await Portfolio.findByIdAndUpdate(id, { ...body, id }, { new: true });
        const responsePortfolio = {
            id: updatedPortfolio._id,
            name: updatedPortfolio.name,
            url: updatedPortfolio.url,
            image: updatedPortfolio.image,
            description: updatedPortfolio.description,
            superCard: updatedPortfolio.superCard,
            file: updatedPortfolio.superCard,
        }

        return res.status(200).json(responsePortfolio);
    } catch (err) {
        console.log(err)
        return res.status(400).json(err);
    }
}
export const deletePortfolio = async (req, res) => {
    // #swagger.tags = ['Cards']
    try {
        const { portfolioId: id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No portfolio with that id");

        let done = await Portfolio.findOneAndDelete({ _id: id });
        if(done){
            return res.status(200).json("Deleted successfully");
        }
    } catch (err) {
        return res.status(401).send(err.message);
    }

}