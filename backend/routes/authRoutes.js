const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  verifyEmail,
  forgotPassword,
  resetPassword,
  requestOtp, 
  googleLogin 
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/request-otp', requestOtp);
router.post('/google', googleLogin);

module.exports = router;
