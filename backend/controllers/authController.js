const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate JWT Token
// If rememberMe is true, token lasts 30 days, else 1 day.
const generateToken = (id, role, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : '1d';
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secretkey123', {
    expiresIn,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'customer',
      resetPasswordToken: hashedVerificationToken, // Re-using this field for email verification temporarily
      resetPasswordExpire: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    if (user) {
      // Mock sending email
      const verifyUrl = `http://localhost:3000/verify-email/${verificationToken}`;
      console.log(`\n\n*** MOCK EMAIL SENDER ***\nTo: ${email}\nSubject: Verify your email\nBody: Click here to verify: ${verifyUrl}\n\n`);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: 'Registration successful. Please check your email to verify your account (Mocked).'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Email successfully verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe, adminOnly } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check Role Based Authentication (e.g., Admin Portal)
    if (adminOnly && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admins Only' });
    }

    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id, user.role, rememberMe),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Mock sending email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    console.log(`\n\n*** MOCK EMAIL SENDER ***\nTo: ${user.email}\nSubject: Password Reset Request\nBody: Click here to reset your password: ${resetUrl}\n\n`);

    res.json({ message: 'Password reset link sent to email (Mocked)' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.json({ message: 'Password has been successfully reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mock OTP Request
// @route   POST /api/auth/request-otp
// @access  Public
const requestOtp = async (req, res) => {
  const { phone } = req.body;
  // Mock OTP Generation
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`\n\n*** MOCK SMS SENDER ***\nTo: ${phone}\nMessage: Your Rishabh Store OTP is ${otp}. It expires in 5 minutes.\n\n`);
  res.json({ message: `OTP sent successfully to ${phone} (Mock)` });
};

// @desc    Mock Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { token } = req.body; // Google OAuth token
  // In a real app, verify the token via google-auth-library
  res.json({ message: "Google login successful (Mock)" });
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  requestOtp,
  googleLogin
};
