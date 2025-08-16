const File = require('../models/File');
const fs = require('fs');
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

// code to rename a file
// route -  PUT /api/files/:id
exports.renameFile = async (req, res) => {
    try {
        const { newName } = req.body;
        if (!newName || newName.trim() === '') {
            return res.status(400).json({ message: 'New name is required' });
        }

        const file = await File.findById(req.params.id);

        //  ensure the file exists and the user owns it for safety
        if (!file || file.userId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Constructing the old and new file paths
        const oldPath = file.path;
        const fileExtension = path.extname(file.originalName);
        const newOriginalName = newName.trim() + fileExtension;
        const newPath = path.join(path.dirname(oldPath), path.basename(oldPath, path.extname(oldPath)) + fileExtension); // Keep stored name but update original
        const newStoredName = path.basename(oldPath);
        const newFilePath = path.join(path.dirname(oldPath), newStoredName);

        
        // This just updates the 'originalName' in the database. 
        // only changing the user-facing name to prevent complex logic
        
        file.originalName = newName.trim() + path.extname(file.originalName);
        await file.save();

        res.json({ message: 'File renamed successfully', file });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while renaming file.' });
    }
};