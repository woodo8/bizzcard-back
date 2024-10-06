    import cron from 'node-cron';
    import { createReceipt, payReceipt } from '../services/receiptCreateAndPay.js';
    import Subscription from '../models/subscriptionSchema.js'; // Your subscription model
    import { PaymentCard } from '../models/paymentCardSchema.js'; // Your card/token model

    // This job runs every day at midnight to check for users that need to be charged
    cron.schedule('0 0 * * *', async () => {

        // // Schedule a task to run every minute for testing purposes
        // cron.schedule('* * * * *', async () => {
        // console.log('Running daily subscription charge check');

        try {
            // Fetch all active subscriptions where the next billing date is today or in the past
            const today = new Date();
            const subscriptionsToCharge = await Subscription.find({
                nextBillingDate: { $lte: today },
                status: 'active'
            });

            for (const subscription of subscriptionsToCharge) {
                try {
                    // Get the user's token and subscription details
                    const userCard = await PaymentCard.findOne({ owner: subscription.userId });
                    if (!userCard || !userCard.verify) {
                        console.log(`No valid payment card found for user: ${subscription.userId}`);
                        continue;
                    }

                    // Create a receipt for the monthly payment
                    const receipt = await createReceipt(subscription.amount, subscription.orderId, 'Monthly subscription');

                    // Pay the receipt
                    await payReceipt(receipt.paymeReceiptId, userCard.token, subscription.userId, subscription.amount);

                    // Update the subscription's next billing date to next month
                    const nextBillingDate = new Date();
                    nextBillingDate.setMonth(today.getMonth() + 1);

                    subscription.nextBillingDate = nextBillingDate;
                    await subscription.save();
                    console.log("subscription" + subscription)
                    console.log(`Successfully charged user ${subscription.userId} for subscription.`);
                } catch (err) {
                    console.error(`Failed to charge user ${subscription.userId}:`, err.message);
                    // Handle error, maybe send an alert, or mark subscription for retry
                }
            }
        } catch (err) {
            console.error('Error running subscription charge cron:', err.message);
        }
    });
