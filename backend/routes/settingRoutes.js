const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Setting = require('../models/Setting');

// Get settings
router.get('/', protect, async (req, res) => {
  try {
    let setting = await Setting.findOne({ user: req.user._id });
    if (!setting) {
      setting = await Setting.create({ user: req.user._id });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Update settings
router.put('/', protect, async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
