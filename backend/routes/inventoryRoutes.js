const express = require('express');
const router = express.Router();
const { 
  getLowStockAlerts, 
  getExpiringProducts, 
  getInventoryReport,
  createSupplier,
  getSuppliers,
  createPurchaseOrder,
  receivePurchaseOrder
} = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware'); // would normally use admin middleware too

// Alerts & Reports
router.route('/low-stock').get(protect, getLowStockAlerts);
router.route('/expiring').get(protect, getExpiringProducts);
router.route('/report').get(protect, getInventoryReport);

// Suppliers
router.route('/suppliers').get(protect, getSuppliers).post(protect, createSupplier);

// Purchase Orders
router.route('/purchase').post(protect, createPurchaseOrder);
router.route('/purchase/:id/receive').put(protect, receivePurchaseOrder);

module.exports = router;
