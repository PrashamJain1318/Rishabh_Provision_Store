const express = require('express');
const router = express.Router();
const { getSalesAnalytics, getTopProducts, getSummaryKPIs } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware'); // Admin middleware can be chained here

router.route('/sales').get(protect, getSalesAnalytics);
router.route('/top-products').get(protect, getTopProducts);
router.route('/summary').get(protect, getSummaryKPIs);

module.exports = router;
