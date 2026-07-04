const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get Sales Analytics (Daily/Monthly/Yearly)
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const { period } = req.query; // 'daily', 'monthly', 'yearly'
    
    let format = "%Y-%m-%d"; // default daily
    if (period === 'monthly') format = "%Y-%m";
    if (period === 'yearly') format = "%Y";

    const sales = await Order.aggregate([
      {
        // Only count successful orders
        $match: { status: { $ne: 'Cancelled' } }
      },
      {
        $group: {
          _id: { $dateToString: { format, date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format response and inject mock 20% profit margin
    const formattedSales = sales.map(s => ({
      date: s._id,
      revenue: s.totalRevenue,
      profit: s.totalRevenue * 0.20,
      orders: s.orderCount
    }));

    res.json(formattedSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Top Selling Products
// @route   GET /api/analytics/top-products
// @access  Private/Admin
const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Populate product details manually since aggregate doesn't populate easily without $lookup
    const populated = await Product.populate(topProducts, { path: '_id', select: 'name categoryId images' });

    const formatted = populated.filter(p => p._id).map(p => ({
      id: p._id._id,
      name: p._id.name,
      image: p._id.images[0],
      totalSold: p.totalSold,
      revenue: p.totalRevenue
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get High-level Summary KPI
// @route   GET /api/analytics/summary
// @access  Private/Admin
const getSummaryKPIs = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    
    const revenueAggr = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
    ]);

    const revenue = revenueAggr[0] ? revenueAggr[0].totalRevenue : 0;
    const orders = revenueAggr[0] ? revenueAggr[0].totalOrders : 0;
    const profit = revenue * 0.20;

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders,
      revenue,
      profit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSalesAnalytics,
  getTopProducts,
  getSummaryKPIs
};
