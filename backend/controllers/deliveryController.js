const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

// @desc    Get today's assigned deliveries for the logged-in delivery boy
// @route   GET /api/delivery/today
// @access  Private (DeliveryBoy only)
const getTodayDeliveries = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deliveries = await Delivery.find({
      deliveryBoyId: req.user._id,
      assignedAt: { $gte: today },
    }).populate('orderId').sort({ assignedAt: -1 });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update delivery status (e.g. EnRoute)
// @route   PUT /api/delivery/:id/status
// @access  Private (DeliveryBoy only)
const updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    delivery.status = req.body.status;
    if (req.body.status === 'PickedUp') delivery.pickedUpAt = Date.now();

    await delivery.save();
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and mark as Delivered
// @route   POST /api/delivery/:id/verify-otp
// @access  Private (DeliveryBoy only)
const verifyOtpAndDeliver = async (req, res) => {
  const { otp } = req.body;
  
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    if (delivery.otp === otp) {
      delivery.status = 'Delivered';
      delivery.deliveredAt = Date.now();
      await delivery.save();

      // Also update the main Order status
      const order = await Order.findById(delivery.orderId);
      if (order) {
        order.status = 'Delivered';
        await order.save();
      }

      res.json({ message: 'OTP verified successfully. Order Delivered.', delivery });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get delivery boy stats (Earnings, Ratings, Total Deliveries)
// @route   GET /api/delivery/stats
// @access  Private (DeliveryBoy only)
const getDeliveryStats = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ 
      deliveryBoyId: req.user._id, 
      status: 'Delivered' 
    });

    const totalEarnings = deliveries.reduce((acc, curr) => acc + curr.earnings, 0);
    const totalDeliveries = deliveries.length;
    
    const ratedDeliveries = deliveries.filter(d => d.rating);
    const avgRating = ratedDeliveries.length > 0 
      ? (ratedDeliveries.reduce((acc, curr) => acc + curr.rating, 0) / ratedDeliveries.length).toFixed(1)
      : '5.0';

    res.json({ totalEarnings, totalDeliveries, avgRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTodayDeliveries, updateDeliveryStatus, verifyOtpAndDeliver, getDeliveryStats };
