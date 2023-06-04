import mongoose, { Schema } from "mongoose";
import Joi from "joi";

const bizzCardSchema = mongoose.Schema({
    owner: {
        type: String,
    },
    type: {
        type: String,
        enum: ["FREE", "PREMIUM"],
    },
    corporate: {
        type: Boolean,
    },
    name: {
        type: String,
        required: true,
    },
    expertise: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    profile_img: {
        type: String,
    },
    profile_img_shape: {
        type: String,
        enum: ["SQUARE", "CIRCLE"],
        default: "SQUARE",
    },
    background_img: {
        type: String,
    },
    page_bg: {
        type: String,
    },
    background_color: {
        type: String,
        enum: ["MAIN", "BLUE", "WHITE"],
    },
    main_color: {
        type: String,
        enum: ["BLACK", "GREEN", "WHITE"],
    },
    location: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    email: {
        type: String,
    },
    facebook: {
        type: String,
    },
    telegram: {
        type: String,
    },
    instagram: {
        type: String,
    },
    mobile: {
        type: String,
    },
    websiteLink: {
        type: String,
    },
    draftContent: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    timeFrom: {
        type: String,
    },
    timeUntil: {
        type: String,
    },
    services: {
        type: String,
    },
    qualities: {
        type: String,
        default: null,
    }
});

const BizzCard = mongoose.model('BizzCard', bizzCardSchema);

const validateCard = (card) => {
    const schema = Joi.object({
        type: Joi.string().valid("FREE", "PREMIUM").required(),
        owner: Joi.string().required(),
        name: Joi.string().required(),
        expertise: Joi.string().required(),
        description: Joi.string().required(),
        profile_img: Joi.string(),
        profile_img_shape: Joi.string().valid("SQUARE", "CIRCLE"),
        background_color: Joi.string().valid("MAIN", "BLUE"),
        background_img: Joi.string(),
        page_bg: Joi.string(),
        main_color: Joi.string().valid("BLACK", "GREEN", "WHITE"),
        location: Joi.string(),
        linkedin: Joi.string(),
        email: Joi.string().email(),
        facebook: Joi.string(),
        telegram: Joi.string(),
        instagram: Joi.string(),
        mobile: Joi.number(),
        websiteLink: Joi.string(),
        draftContent: Joi.string(),
        timeFrom: Joi.string(),
        timeUntil: Joi.string(),
        services: Joi.string(),
        qualities: Joi.string(),
    });
    return schema.validate(card);
}
export { BizzCard, validateCard };