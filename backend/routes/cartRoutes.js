const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, applyCoupon } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getCart);
router.route('/add').post(protect, addToCart);
router.route('/update').put(protect, updateCartItem);
router.route('/remove/:productId').delete(protect, removeFromCart);
router.route('/apply-coupon').post(protect, applyCoupon);

module.exports = router;
