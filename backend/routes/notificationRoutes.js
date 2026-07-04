const express = require('express');
const router = express.Router();
const { subscribePush, updatePreferences } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');
const Notification = require('../models/Notification');

router.route('/subscribe').post(protect, subscribePush);
router.route('/preferences').put(protect, updatePreferences);

// Get all notifications for user
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
