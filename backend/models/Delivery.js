const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Assigned', 'PickedUp', 'EnRoute', 'Delivered', 'Failed'],
      default: 'Assigned',
    },
    otp: {
      type: String, // 4-digit code generated for customer to give to delivery boy
      required: true,
    },
    assignedAt: { type: Date, default: Date.now },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
    earnings: {
      type: Number,
      default: 40, // Base delivery fee
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Delivery', deliverySchema);
