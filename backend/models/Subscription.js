const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
    required: true
  },
  nextDeliveryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  },
  deliveryAddress: {
    type: Object, // Stores the snapshot of the address chosen
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
