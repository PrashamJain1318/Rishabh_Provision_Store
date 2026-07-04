const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Reward = require('../models/Reward');

// Get reward points and tier
router.get('/', protect, async (req, res) => {
  try {
    let reward = await Reward.findOne({ user: req.user._id });
    if (!reward) {
      reward = await Reward.create({ user: req.user._id });
    }
    
    // Mock History
    const history = [
      { id: 1, type: 'earned', points: 150, description: 'Order #ORD-8492', date: new Date(Date.now() - 86400000).toISOString() },
      { id: 2, type: 'redeemed', points: 50, description: 'Discount applied to Order #ORD-8488', date: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 3, type: 'earned', points: 200, description: 'Referral Bonus', date: new Date(Date.now() - 86400000 * 5).toISOString() },
    ];

    res.json({
      reward,
      history
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
