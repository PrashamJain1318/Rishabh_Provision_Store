const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Wallet = require('./models/Wallet');
const WalletTransaction = require('./models/WalletTransaction');
const Reward = require('./models/Reward');
const Notification = require('./models/Notification');
const Invoice = require('./models/Invoice');
const Setting = require('./models/Setting');
const Coupon = require('./models/Coupon');

dotenv.config();

const seedDashboard = async () => {
  try {
    await connectDB();

    // 1. Get the demo customer user
    let user = await User.findOne({ email: 'customer@example.com' });
    if (!user) {
      console.log('Demo customer not found, creating one...');
      user = await User.create({
        name: 'Demo Customer',
        email: 'customer@example.com',
        phone: '+919876543210',
        password: 'password123',
        role: 'customer'
      });
    }
    const userId = user._id;

    console.log('Clearing old dashboard data...');
    await Wallet.deleteMany({ user: userId });
    await WalletTransaction.deleteMany({});
    await Reward.deleteMany({ user: userId });
    await Notification.deleteMany({ user: userId });
    await Invoice.deleteMany({ user: userId });
    await Setting.deleteMany({ user: userId });
    await Coupon.deleteMany({});

    console.log('Seeding new dashboard data...');

    // 2. Seed Wallet & Transactions
    const wallet = await Wallet.create({
      user: userId,
      balance: 2850,
      cashback: 350,
      rewardCoins: 1250
    });

    const txTypes = ['deposit', 'purchase', 'cashback', 'referral'];
    for (let i = 0; i < 15; i++) {
      const type = i % 3 === 0 ? 'debit' : 'credit';
      const category = txTypes[i % txTypes.length];
      await WalletTransaction.create({
        wallet: wallet._id,
        type: type,
        amount: Math.floor(Math.random() * 500) + 50,
        description: type === 'credit' ? `Added via ${category}` : `Paid for Order #RISH${1000 + i}`,
        category: category,
        referenceId: `REF${Date.now()}${i}`,
      });
    }

    // 3. Seed Reward Points
    await Reward.create({
      user: userId,
      points: 1250,
      lifetimeEarned: 6250,
      vipLevel: 'Gold'
    });

    // 4. Seed Coupons
    const couponsData = [
      { code: 'WELCOME100', discountType: 'flat', discountValue: 100, minOrderValue: 500, expiryDate: new Date(Date.now() + 86400000 * 30), usageLimit: 1 },
      { code: 'SAVE250', discountType: 'flat', discountValue: 250, minOrderValue: 1000, expiryDate: new Date(Date.now() + 86400000 * 15), usageLimit: 5 },
      { code: 'FESTIVAL500', discountType: 'percentage', discountValue: 20, maxDiscount: 500, minOrderValue: 2000, expiryDate: new Date(Date.now() + 86400000 * 7), usageLimit: 2 },
      { code: 'FREEDELIVERY', discountType: 'flat', discountValue: 50, minOrderValue: 300, expiryDate: new Date(Date.now() + 86400000 * 60), usageLimit: null },
    ];
    await Coupon.insertMany(couponsData);

    // 5. Seed Notifications (20 realistic)
    const notifMessages = [
      "Your order #ORD-9842 has been delivered.",
      "Flash sale is live! Get 50% off on all organic fruits.",
      "You earned 50 reward points from your last purchase.",
      "Your wallet was recharged with ₹500 successfully.",
      "Coupon FESTIVAL500 is expiring in 2 days!",
      "New login detected on Chrome (Mac OS).",
      "Refund of ₹250 initiated to your wallet.",
      "Your wishlist item 'Farm Fresh Tomatoes' is back in stock!",
      "Rate your last delivery experience to earn 10 points.",
      "Your VIP tier has been upgraded to Gold!"
    ];
    const notifs = [];
    for (let i = 0; i < 20; i++) {
      notifs.push({
        user: userId,
        title: i % 2 === 0 ? "Order Update" : "Promotion Alert",
        message: notifMessages[i % notifMessages.length],
        type: ['order', 'payment', 'delivery', 'promo', 'alert', 'system'][i % 6],
        isRead: i > 5, // First 5 are unread
      });
    }
    await Notification.insertMany(notifs);

    // 6. Seed Invoices (15 realistic)
    const invoices = [];
    for (let i = 0; i < 15; i++) {
      const amt = Math.floor(Math.random() * 2000) + 200;
      invoices.push({
        user: userId,
        invoiceNumber: `INV-2026-${1000 + i}`,
        amount: amt,
        tax: Math.floor(amt * 0.18),
        status: i % 10 === 0 ? 'Refunded' : 'Paid',
        createdAt: new Date(Date.now() - 86400000 * i)
      });
    }
    await Invoice.insertMany(invoices);

    // 7. Seed Settings
    await Setting.create({
      user: userId,
      preferences: { theme: 'system', language: 'en' },
      notifications: { email: true, sms: false, push: true, promotional: true },
      security: { twoFactorEnabled: false, loginAlerts: true }
    });

    console.log('Dashboard Data Seeded Successfully!');
    process.exit(0);

  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

seedDashboard();
