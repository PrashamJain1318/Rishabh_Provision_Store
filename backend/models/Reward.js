const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    lifetimeEarned: {
      type: Number,
      default: 0,
    },
    vipLevel: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze',
    }
  },
  {
    timestamps: true,
  }
);

// Auto update VIP Level based on lifetimeEarned
rewardSchema.pre('save', function (next) {
  if (this.lifetimeEarned >= 10000) this.vipLevel = 'Platinum';
  else if (this.lifetimeEarned >= 5000) this.vipLevel = 'Gold';
  else if (this.lifetimeEarned >= 1000) this.vipLevel = 'Silver';
  else this.vipLevel = 'Bronze';
  next();
});

module.exports = mongoose.model('Reward', rewardSchema);
