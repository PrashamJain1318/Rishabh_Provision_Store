const express = require('express');
const router = express.Router();
const { getMyTickets, createTicketOrMessage } = require('../controllers/supportController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getMyTickets).post(protect, createTicketOrMessage);

module.exports = router;
