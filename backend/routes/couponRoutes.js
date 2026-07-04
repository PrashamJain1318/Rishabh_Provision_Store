const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Coupon = require('../models/Coupon');

// Get coupons available for user
router.get('/', protect, async (req, res) => {
  try {
    // Return all valid coupons for the dashboard
    const coupons = await Coupon.find({ expiryDate: { $gt: new Date() } });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
