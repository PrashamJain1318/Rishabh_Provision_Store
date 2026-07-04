const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// Initialize Razorpay with Mock/Test Keys (Can be overridden by process.env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_secret',
});

// Helper to clear cart
const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ userId }, { items: [], couponCode: null });
};

// @desc    Create Razorpay Order
// @route   POST /api/checkout/create-order
// @access  Private
const createOrder = async (req, res) => {
  const { amount, address, deliverySlot } = req.body;

  try {
    const userCart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Step 1: Create a Pending Order in Database
    const dbOrder = new Order({
      customerId: req.user._id,
      items: userCart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.sellingPrice,
      })),
      totalAmount: amount, // Ideally recalculate on backend for security
      deliveryAddress: address,
      deliverySlot: deliverySlot,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Pending',
    });

    // Step 2: Create Razorpay Order (Simulated if keys are mock)
    // If we use the mock keys, the razorpay.orders.create will fail authentication.
    // For this MVP, we will simulate the Razorpay Order creation if actual keys are missing.
    let rzpOrderId = `order_mock_${Date.now()}`;
    
    if (process.env.RAZORPAY_KEY_ID) {
      const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        receipt: `receipt_${dbOrder._id}`,
      };
      const rzpOrder = await razorpay.orders.create(options);
      rzpOrderId = rzpOrder.id;
    }

    dbOrder.razorpayOrderId = rzpOrderId;
    await dbOrder.save();

    res.json({
      orderId: dbOrder._id,
      razorpayOrderId: rzpOrderId,
      amount: amount * 100,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/checkout/verify
// @access  Private
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

  try {
    // If using real keys, verify signature
    if (process.env.RAZORPAY_KEY_SECRET) {
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: 'Payment verification failed' });
      }
    }

    // Mark order as placed
    const order = await Order.findById(dbOrderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentStatus = 'Completed';
    order.status = 'Placed';
    order.timeline.push({ status: 'Order Placed & Paid', timestamp: Date.now() });
    await order.save();

    await clearCart(req.user._id);

    const user = await User.findById(req.user._id);
    const emailPreviewUrl = await sendOrderConfirmationEmail(user.email, order);

    res.json({ message: 'Payment successful', orderId: order._id, emailPreview: emailPreviewUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Checkout via Cash on Delivery
// @route   POST /api/checkout/cod
// @access  Private
const checkoutCOD = async (req, res) => {
  const { amount, address, deliverySlot } = req.body;

  try {
    const userCart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const dbOrder = new Order({
      customerId: req.user._id,
      items: userCart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.sellingPrice,
      })),
      totalAmount: amount,
      deliveryAddress: address,
      deliverySlot: deliverySlot,
      paymentMethod: 'COD',
      paymentStatus: 'Pending', // Will be collected on delivery
      status: 'Placed',
    });

    dbOrder.timeline.push({ status: 'Order Placed (COD)', timestamp: Date.now() });
    await dbOrder.save();

    await clearCart(req.user._id);

    const user = await User.findById(req.user._id);
    const emailPreviewUrl = await sendOrderConfirmationEmail(user.email, dbOrder);

    res.status(201).json({ message: 'Order Placed Successfully', orderId: dbOrder._id, emailPreview: emailPreviewUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment, checkoutCOD };
