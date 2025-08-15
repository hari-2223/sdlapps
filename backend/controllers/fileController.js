const File = require('../models/File');
const path = require('path');

//   code to upload file
// route   POST /api/files/upload
exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file' });
    }

    try {
        const newFile = await File.create({
            userId: req.user.id,
            originalName: req.file.originalname,
            path: req.file.path,
            size: req.file.size,
        });
        res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
        res.status(500).json({ message: 'Server error while uploading file.' });
    }
};

// code to list files
// route   GET /api/files
exports.getFiles = async (req, res) => {
    try {
        const files = await File.find({ userId: req.user.id }).sort({ uploadDate: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};