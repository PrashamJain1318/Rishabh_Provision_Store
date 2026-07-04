const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // Snapshotted price at order time
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Card', 'UPI', 'Wallet', 'Razorpay'],
      required: true,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    deliverySlot: {
      type: String,
      default: 'Standard',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    status: {
      type: String,
      enum: ['Placed', 'Packing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    timeline: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    // CHECKOUT LOGISTICS
    deliveryType: { type: String, enum: ['Standard', 'Express', 'Pickup'], default: 'Standard' },
    contactlessDelivery: { type: Boolean, default: false },
    deliveryInstructions: { type: String, default: '' },
    orderNotes: { type: String, default: '' },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    },
    // CHECKOUT FINANCIALS
    couponCode: { type: String, default: null },
    giftCardCode: { type: String, default: null },
    walletUsed: { type: Number, default: 0 },
    cashbackEarned: { type: Number, default: 0 },
    rewardPointsEarned: { type: Number, default: 0 },
    gstNumber: { type: String, default: null },
    // REAL-TIME TRACKING
    deliveryOtp: { type: String, default: null },
    estimatedDeliveryTime: { type: Date },
    driverLocation: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
