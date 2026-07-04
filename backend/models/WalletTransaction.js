const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['deposit', 'withdrawal', 'purchase', 'refund', 'cashback', 'referral', 'promotional'],
      default: 'deposit',
    },
    referenceId: {
      type: String, // Order ID or Payment Gateway ID
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
