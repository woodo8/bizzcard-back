import { PaymentCard, validatePaymentCard } from "../models/paymentCardSchema.js";
import mongoose from "mongoose";
import { createReceipt, payReceipt } from "../services/receiptCreateAndPay.js";
import Subscription from "../models/subscriptionSchema.js";
import { User } from "../models/userSchema.js";

export const createNewPaymentCard = async (req, res) => {
    // #swagger.tags = ['PaymentCards']
    try {

        // Find the user by the id in params
        const { ownerId: ownerId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(ownerId)) return res.status(404).send("No user with that id")

        const existingCard = await PaymentCard.findOne({ owner: ownerId });
        if (existingCard) {
            // If a card exists, delete it
            await PaymentCard.deleteOne({ owner: ownerId });
            console.log(`Deleted the existing card for owner: ${ownerId}`);
        }

        // Create the new Card
        let newCard = {
            ...req.body,
            owner: ownerId,
        };

        // Validate errors
        const { error } = validatePaymentCard(newCard);
        if (error) {
            console.log(error)
            return res.status(400).send(error.details[0].message);
        }

        // Save the new card in the database
        newCard = await new PaymentCard(newCard);
        await newCard.save();
        return res.status(200).json(newCard);
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
}

export const updatePaymentCardVerificationByToken = async (req, res) => {
    // #swagger.tags = ['PaymentCards']
    try {
        // Extract the token from the request body (or req.params if it's part of the URL)
        const { token } = req.body;
        const amount = 100000;
        if (!token) {
            return res.status(400).send("Token is required.");
        }

        // Find the payment card by its token
        const existingCard = await PaymentCard.findOne({ token });

        if (!existingCard) {
            return res.status(404).send("No payment card found with that token.");
        }

        // Update the verify field to true
        existingCard.verify = true;

        // Save the updated card in the database
        await existingCard.save();

        // check if there is existing subscription to avoid double charging of client
        // const existingSubscription = await Subscription.findOne({ userId: existingCard.owner });

        // if (existingSubscription) {
        //     throw new Error('Subscription already exists for this user.');
        // }

        const receipt = await createReceipt(amount, `order-${existingCard.owner}`, 'Initial payment');

        // Optionally, call payReceipt service to pay for the receipt immediately
        const paidReceipt = await payReceipt(receipt.paymeReceiptId, token, existingCard.owner, amount);

        const nextBillingDate = new Date();
        // nextBillingDate.setMonth(today.getMonth() + 1);

        nextBillingDate.setMinutes(nextBillingDate.getMinutes() + 1); // Set the date to one minute later

        // Create a new subscription in the database
        const newSubscription = new Subscription({
            userId: existingCard.owner,
            orderId: `order-${existingCard.owner}`, // Or use a specific order ID
            amount,
            nextBillingDate,
        });

        await newSubscription.save();

        await User.findByIdAndUpdate(existingCard.owner, { subscription: "PREMIUM" }, { new: true })

        return res.status(200).json({ message: "Payment card verified successfully", card: existingCard, receipt: paidReceipt });
    } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
    }
};