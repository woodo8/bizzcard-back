import Joi from "joi";
import mongoose from "mongoose";

const portfolio = mongoose.Schema({
    name: {
        type: String,
    },
    url: {
        type: String,
    },
    image: {
        type: String,
    },
    description: {
        type: String,
    },
    superCard: {
        type: String,
        required: true,
    },
});


const Portfolio = mongoose.model('Portfolio', portfolio);

const validatePortfolio = (card) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        url: Joi.string().uri(),
        image: Joi.any(),
        description: Joi.string(),
        superCard: Joi.string().required,

    });
    return schema.validate(card);
}

export { Portfolio, validatePortfolio };