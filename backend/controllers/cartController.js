const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// Helper to calculate totals
const calculateCartTotals = async (cart) => {
  let subtotal = 0;
  let totalTax = 0;

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (product) {
      const itemTotal = product.sellingPrice * item.quantity;
      subtotal += itemTotal;
      // Calculate tax amount based on inclusive/exclusive rules. Assuming sellingPrice is exclusive of tax for calculation here.
      totalTax += (itemTotal * (product.gstPercentage || 0)) / 100;
    }
  }

  let deliveryCharges = subtotal > 500 ? 0 : 40;
  let discount = 0;

  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode.toUpperCase(), isActive: true });
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        discount = (subtotal * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }
      if (subtotal < coupon.minOrderValue) {
        discount = 0; // Invalid coupon context
        cart.couponCode = null; // Strip invalid coupon
      }
    }
  }

  const estimatedTotal = subtotal + totalTax + deliveryCharges - discount;

  return { subtotal, totalTax, deliveryCharges, discount, estimatedTotal };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const totals = await calculateCartTotals(cart);
    res.json({ cart, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      // Product exists, update quantity
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      // Product does not exist, add it
      cart.items.push({ productId, quantity: quantity || 1 });
    }

    await cart.save();
    
    // Repopulate and calculate
    cart = await Cart.findById(cart._id).populate('items.productId');
    const totals = await calculateCartTotals(cart);

    res.json({ cart, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      await cart.save();
      
      cart = await Cart.findById(cart._id).populate('items.productId');
      const totals = await calculateCartTotals(cart);
      res.json({ cart, totals });
    } else {
      res.status(404).json({ message: 'Item not in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();

    cart = await Cart.findById(cart._id).populate('items.productId');
    const totals = await calculateCartTotals(cart);
    res.json({ cart, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply Coupon
// @route   POST /api/cart/apply-coupon
// @access  Private
const applyCoupon = async (req, res) => {
  const { code } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    if (!code) {
      cart.couponCode = null;
    } else {
      const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
      if (!coupon) return res.status(400).json({ message: 'Invalid or expired coupon' });
      cart.couponCode = coupon.code;
    }

    await cart.save();
    
    cart = await Cart.findById(cart._id).populate('items.productId');
    const totals = await calculateCartTotals(cart);
    res.json({ cart, totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, applyCoupon };
