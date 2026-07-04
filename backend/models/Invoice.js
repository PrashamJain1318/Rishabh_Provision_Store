const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Refunded'],
      default: 'Paid',
    },
    pdfUrl: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
