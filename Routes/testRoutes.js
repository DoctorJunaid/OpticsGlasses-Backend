const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/test
 * @desc    Test endpoint to check if backend is working
 * @access  Public
 */
router.get('/', (req, res) => {
    res.status(200).json({
        isStatus: true,
        msg: 'Backend is working!',
        data: {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0'
        }
    });
});

/**
 * @route   GET /api/test/auth
 * @desc    Test authenticated endpoint
 * @access  Private
 */
router.get('/auth', require('../middleware/authMiddleware').verifyToken, (req, res) => {
    res.status(200).json({
        isStatus: true,
        msg: 'Authentication working!',
        data: {
            user: req.user,
            timestamp: new Date().toISOString()
        }
    });
});

/**
 * @route   GET /api/test/admin
 * @desc    Test admin endpoint
 * @access  Private (Admin)
 */
router.get('/admin', require('../middleware/authMiddleware').verifyAdminToken, (req, res) => {
    res.status(200).json({
        isStatus: true,
        msg: 'Admin authentication working!',
        data: {
            admin: req.user,
            timestamp: new Date().toISOString()
        }
    });
});

module.exports = router;