import axios from 'axios';
import Receipt from '../models/receiptSchema.js';  // Import your model if needed
import Subscription from '../models/subscriptionSchema.js';
import { User } from "../models/userSchema.js"
import { sendChargeFailureNotification, sendChargeNotification } from './sendPaymentNotifications.js';

// Function to create a receipt
export const createReceipt = async (amount, order_id, description) => {
  try {
    const payload = {
      id: Date.now(), // Unique request ID, should be different per request
      method: 'receipts.create',
      params: {
        amount: amount * 100,  // Amount in tiyins
        account: { order_id: order_id },
        description: description || '',
      },
    };

    const paymeResponse = await axios.post(process.env.PAYME_URL, payload, {
      headers: {
        'X-auth': process.env.PAYME_KEY, // Replace with your Payme token
        'Content-Type': 'application/json',
      },
    });

    if (paymeResponse.data.error) {
      throw new Error(paymeResponse.data.error.message);
    }

    const newReceipt = new Receipt({
      amount,
      account: { order_id },
      description,
      paymeReceiptId: paymeResponse.data.result.receipt._id,
      status: 'pending',
    });

    await newReceipt.save();
    console.log("receipt created sussessfully")
    return newReceipt;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating receipt');
  }
};

// Function to pay for a receipt
export const payReceipt = async (receiptId, token, clientId, amount) => {
  try {
    const payload = {
      id: Date.now(), // Unique request ID, should be different per request
      method: 'receipts.pay',
      params: {
        id: receiptId,
        token,
      },
    };

    const paymeResponse = await axios.post(process.env.PAYME_URL, payload, {
      headers: {
        'X-auth': process.env.PAYME_KEY, // Replace with your Payme token
        'Content-Type': 'application/json',
      },
    });

    if (paymeResponse.data.error) {
      throw new Error(paymeResponse.data.error.message);
    }

    // Update the receipt in the database
    const updatedReceipt = await Receipt.findOneAndUpdate(
      { paymeReceiptId: receiptId },
      { status: 'paid' },
      { new: true }
    );
    console.log("user charged sussessfully")

    // send notification to the client about charges
    const client = await User.findById(clientId);

    let userPayload = { email: client.email, name: client.full_name };
    let chargePayload = { amount }
    sendChargeNotification(userPayload, chargePayload)

    return updatedReceipt;
  } catch (error) {
    console.error(error);
    const client = await User.findById(clientId);

    let userPayload = { email: client.email, name: client.full_name };
    let chargePayload = { amount }
    sendChargeFailureNotification(userPayload, chargePayload, error)
    let responsee = await Subscription.findOneAndUpdate({ userId: clientId }, {
      nextBillingDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      updatedAt: Date.now(),
    });
    console.log(responsee)
    throw new Error('Error paying for receipt');
  }
};
 