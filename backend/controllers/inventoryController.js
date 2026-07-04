const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const Purchase = require('../models/Purchase');

// @desc    Get Low Stock Alerts
// @route   GET /api/inventory/low-stock
// @access  Private/Admin
const getLowStockAlerts = async (req, res) => {
  try {
    // MongoDB aggregation to find items where stock <= lowStockThreshold
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] }
    }).select('name stock lowStockThreshold categoryId').populate('categoryId', 'name');
    
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Expiring Products (within 30 days)
// @route   GET /api/inventory/expiring
// @access  Private/Admin
const getExpiringProducts = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const expiringProducts = await Product.find({
      expiresAt: { $gte: today, $lte: thirtyDaysFromNow }
    }).select('name stock expiresAt barcode');

    res.json(expiringProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Inventory Report
// @route   GET /api/inventory/report
// @access  Private/Admin
const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name');
    
    let totalValuation = 0;
    let totalItems = 0;
    const categoryBreakdown = {};

    products.forEach(p => {
      const value = p.stock * p.mrp;
      totalValuation += value;
      totalItems += p.stock;

      const catName = p.categoryId?.name || 'Uncategorized';
      if (!categoryBreakdown[catName]) {
        categoryBreakdown[catName] = { stock: 0, value: 0 };
      }
      categoryBreakdown[catName].stock += p.stock;
      categoryBreakdown[catName].value += value;
    });

    res.json({
      totalValuation,
      totalItems,
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a Supplier
// @route   POST /api/inventory/suppliers
// @access  Private/Admin
const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Suppliers
// @route   GET /api/inventory/suppliers
// @access  Private/Admin
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Purchase Order
// @route   POST /api/inventory/purchase
// @access  Private/Admin
const createPurchaseOrder = async (req, res) => {
  try {
    const po = await Purchase.create(req.body);
    res.status(201).json(po);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Receive Purchase Order (Increments Stock)
// @route   PUT /api/inventory/purchase/:id/receive
// @access  Private/Admin
const receivePurchaseOrder = async (req, res) => {
  try {
    const po = await Purchase.findById(req.params.id);
    if (!po) return res.status(404).json({ message: 'PO not found' });
    if (po.status === 'Received') return res.status(400).json({ message: 'PO already received' });

    // Increment stock for each product
    for (const item of po.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }

    po.status = 'Received';
    po.receivedAt = Date.now();
    await po.save();

    res.json({ message: 'PO Received and Inventory Updated', po });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLowStockAlerts,
  getExpiringProducts,
  getInventoryReport,
  createSupplier,
  getSuppliers,
  createPurchaseOrder,
  receivePurchaseOrder
};
