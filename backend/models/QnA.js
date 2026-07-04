const mongoose = require('mongoose');

const qnaSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: ''
  },
  isAnswered: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('QnA', qnaSchema);
