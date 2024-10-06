import mongoose from 'mongoose';

const receiptSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  account: { type: Object, required: true },
  description: { type: String, default: '' },
  paymeReceiptId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Receipt = mongoose.model('Receipt', receiptSchema);

export default Receipt;
