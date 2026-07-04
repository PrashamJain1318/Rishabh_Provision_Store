const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    preferences: {
      theme: { type: String, enum: ['system', 'light', 'dark'], default: 'system' },
      language: { type: String, default: 'en' },
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      promotional: { type: Boolean, default: true },
    },
    security: {
      twoFactorEnabled: { type: Boolean, default: false },
      loginAlerts: { type: Boolean, default: true },
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Setting', settingSchema);
