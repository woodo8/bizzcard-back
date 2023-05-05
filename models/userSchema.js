import mongoose from "mongoose";
import Joi from "joi";

const userSchema = mongoose.Schema(
    {
        subscription: {
            // FREE, PREMIUM
            type: String,
            default: null,
        },  
        full_name: {
            type: String,
            required: true,
            default: null,
        },
        email: {
            type: String,
            required: true,
            default: null,
        },
        password: {
            type: String,
            required: true,
            default: null,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        profile_img: {
            type: String,
        },
        mobile: {
            type: String,
        },
       
    }
)

const User = mongoose.model('User', userSchema);
const validateUser = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        full_name: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).required(),
    });
    return schema.validate(user);
}

export { User, validateUser };