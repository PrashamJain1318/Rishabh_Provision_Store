const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, checkoutCOD } = require('../controllers/checkoutController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/create-order').post(protect, createOrder);
router.route('/verify').post(protect, verifyPayment);
router.route('/cod').post(protect, checkoutCOD);

module.exports = router;
