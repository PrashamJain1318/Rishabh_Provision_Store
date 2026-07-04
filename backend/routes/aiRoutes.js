const express = require('express');
const router = express.Router();
const multer = require('multer');
const { handleChat } = require('../controllers/aiController');

// Multer setup for temporarily storing uploaded images
const upload = multer({ dest: 'uploads/' });

// Route can handle just text, or text + image file
router.post('/chat', upload.single('image'), handleChat);

module.exports = router;
