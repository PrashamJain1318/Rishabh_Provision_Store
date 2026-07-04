const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');

// Get wallet balance and recent transactions
router.get('/', protect, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }
    
    const transactions = await WalletTransaction.find({ wallet: wallet._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      wallet,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Mock Add Money
router.post('/add', protect, async (req, res) => {
  try {
    const { amount } = req.body;
    let wallet = await Wallet.findOne({ user: req.user._id });
    
    wallet.balance += Number(amount);
    await wallet.save();

    await WalletTransaction.create({
      wallet: wallet._id,
      type: 'credit',
      amount: Number(amount),
      description: 'Added money to wallet via Razorpay',
      category: 'deposit',
      referenceId: 'mock_tx_' + Date.now()
    });

    res.json({ message: 'Money added successfully', balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
