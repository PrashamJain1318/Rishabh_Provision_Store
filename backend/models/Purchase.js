const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        costPrice: {
          type: Number,
          required: true,
        },
      }
    ],
    totalCost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Received', 'Cancelled'],
      default: 'Pending',
    },
    receivedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
