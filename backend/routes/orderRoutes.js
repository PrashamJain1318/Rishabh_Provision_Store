const express = require('express');
const router = express.Router();
const { getMyOrders, getOrderById, downloadInvoice } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/invoice').get(protect, downloadInvoice);

module.exports = router;
