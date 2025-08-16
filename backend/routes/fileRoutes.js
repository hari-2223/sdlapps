const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, renameFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware'); 
const upload = require('../middleware/uploadMiddleware'); 

// When POST request comes to /upload, this order
router.post('/upload', protect, upload, uploadFile);
router.get('/', protect, getFiles);
router.put('/:id', authMiddleware, renameFile);

module.exports = router;