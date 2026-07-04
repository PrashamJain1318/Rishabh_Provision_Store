const User = require('../models/User');

// @desc    Subscribe to Web Push Notifications
// @route   POST /api/notifications/subscribe
// @access  Private
const subscribePush = async (req, res) => {
  try {
    const { subscription } = req.body;
    
    if (!subscription) {
      return res.status(400).json({ message: 'Missing subscription object' });
    }

    // Save subscription to the logged in user
    const user = await User.findById(req.user._id);
    user.pushSubscription = subscription;
    user.notificationPreferences.push = true; // auto-enable
    await user.save();

    res.status(200).json({ message: 'Push notifications enabled successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Notification Preferences
// @route   PUT /api/notifications/preferences
// @access  Private
const updatePreferences = async (req, res) => {
  try {
    const { email, sms, whatsapp, push } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (email !== undefined) user.notificationPreferences.email = email;
    if (sms !== undefined) user.notificationPreferences.sms = sms;
    if (whatsapp !== undefined) user.notificationPreferences.whatsapp = whatsapp;
    if (push !== undefined) user.notificationPreferences.push = push;

    await user.save();

    res.json({ message: 'Preferences updated', preferences: user.notificationPreferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { subscribePush, updatePreferences };
