import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true }, // Link to the specific order/subscription
  amount: { type: Number, required: true }, // Subscription amount (in tiyins or converted to amount in Payme's format)
  nextBillingDate: { type: Date, required: true }, // The next date to charge the user
  status: { type: String, enum: ['active', 'canceled'], default: 'active' },
}, {
  timestamps: true,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
