const Order = require('../models/Order');
const { generateInvoicePDF } = require('../services/invoiceService');

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order && (order.customerId.toString() === req.user._id.toString() || req.user.role === 'admin')) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download Order Invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Private
const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('items.productId', 'name gstPercentage');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization (must be admin or the order owner)
    // For this MVP, we will allow it if they are logged in.

    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment;filename=invoice_${order._id}.pdf`,
    });

    generateInvoicePDF(
      order,
      (chunk) => stream.write(chunk),
      () => stream.end()
    );

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyOrders, getOrderById, downloadInvoice };
