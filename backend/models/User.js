const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'delivery'],
      default: 'customer',
    },
    addresses: [
      {
        tag: { type: String, enum: ['Home', 'Work', 'Other'] },
        street: String,
        city: String,
        state: String,
        zipCode: String,
        lat: Number,
        lng: Number,
      },
    ],
    walletBalance: {
      type: Number,
      default: 0,
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    pushSubscription: {
      type: Object, // Stores endpoint and keys for Web Push
      default: null
    },
    // PREMIUM FEATURES
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // AUTHENTICATION & SECURITY
    googleId: {
      type: String,
      sparse: true,
      unique: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    otp: String,
    otpExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
