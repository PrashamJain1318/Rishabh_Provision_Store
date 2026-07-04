const Support = require('../models/Support');

// @desc    Get user's support tickets
// @route   GET /api/support
// @access  Private
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Support.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new support ticket / Send message
// @route   POST /api/support
// @access  Private
const createTicketOrMessage = async (req, res) => {
  const { ticketId, subject, message } = req.body;

  try {
    if (ticketId) {
      // Append message to existing ticket
      const ticket = await Support.findById(ticketId);
      if (ticket && ticket.userId.toString() === req.user._id.toString()) {
        ticket.messages.push({ sender: 'Customer', text: message });
        await ticket.save();
        res.status(201).json(ticket);
      } else {
        res.status(404).json({ message: 'Ticket not found' });
      }
    } else {
      // Create new ticket
      const newTicket = new Support({
        userId: req.user._id,
        subject,
        messages: [{ sender: 'Customer', text: message }],
      });
      const createdTicket = await newTicket.save();
      res.status(201).json(createdTicket);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyTickets, createTicketOrMessage };
