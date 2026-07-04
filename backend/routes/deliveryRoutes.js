const express = require('express');
const router = express.Router();
const { getTodayDeliveries, updateDeliveryStatus, verifyOtpAndDeliver, getDeliveryStats } = require('../controllers/deliveryController');
const { protect } = require('../middlewares/authMiddleware'); // You can add an 'adminOrDeliveryBoy' middleware if needed

router.route('/today').get(protect, getTodayDeliveries);
router.route('/stats').get(protect, getDeliveryStats);
router.route('/:id/status').put(protect, updateDeliveryStatus);
router.route('/:id/verify-otp').post(protect, verifyOtpAndDeliver);

module.exports = router;
