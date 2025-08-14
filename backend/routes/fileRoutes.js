const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware'); 
const upload = require('../middleware/uploadMiddleware'); 

// When POST request comes to /upload, this order
router.post('/upload', authMiddleware, upload, uploadFile);

module.exports = router;