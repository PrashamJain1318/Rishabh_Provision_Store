const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Invoice = require('../models/Invoice');

// Get all invoices for user
router.get('/', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
