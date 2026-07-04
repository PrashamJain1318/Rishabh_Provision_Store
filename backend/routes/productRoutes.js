const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, bulkUploadProducts } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(getProducts).post(protect, createProduct);
router.route('/bulk').post(protect, bulkUploadProducts);
router.route('/:id').get(getProductById).put(protect, updateProduct).delete(protect, deleteProduct);

module.exports = router;
