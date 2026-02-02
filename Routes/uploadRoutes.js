const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const { verifyToken } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/upload
 * @desc    Upload a single image
 * @access  Private
 */
// Use upload.any() to accept files from any field name (e.g., 'image', 'file', 'photo')
router.post("/", verifyToken, upload.any(), (req, res) => {
    try {
        // req.files will hold the array of files when using .any()
        // We take the first one since this is a single upload endpoint
        const file = (req.files && req.files.length > 0) ? req.files[0] : req.file;

        if (!file) {
            return res.status(400).json({ isStatus: false, msg: "No file uploaded" });
        }

        // Cloudinary returns the full URL in file.path
        const filePath = file.path;

        res.status(200).json({
            isStatus: true,
            msg: "Image uploaded successfully",
            data: filePath,
        });
    } catch (error) {
        res.status(500).json({
            isStatus: false,
            msg: error.message || "Upload failed",
        });
    }
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload multiple images
 * @access  Private
 */
router.post("/multiple", verifyToken, upload.array("images", 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ isStatus: false, msg: "No files uploaded" });
        }

        const filePaths = req.files.map(file => file.path);

        res.status(200).json({
            isStatus: true,
            msg: "Images uploaded successfully",
            data: filePaths,
        });
    } catch (error) {
        res.status(500).json({
            isStatus: false,
            msg: error.message || "Upload failed",
        });
    }
});

module.exports = router;
