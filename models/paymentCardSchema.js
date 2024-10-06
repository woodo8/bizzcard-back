import mongoose, { Schema } from "mongoose";
import Joi from "joi";

const paymentCardSchema = mongoose.Schema({
    owner: {
        type: String,
    },
    number: {
        type: String,
    },
    expire: {
        type: String,
    },
    token: {
        type: String,
        required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    }
});

const PaymentCard = mongoose.model('PaymentCard', paymentCardSchema);

const validatePaymentCard = (card) => {
    const schema = Joi.object({
        owner: Joi.string(),
        number: Joi.string(),
        expire: Joi.string(),
        token: Joi.string().required(),
        verify: Joi.boolean(),
    });
    return schema.validate(card);
}
export { PaymentCard, validatePaymentCard };