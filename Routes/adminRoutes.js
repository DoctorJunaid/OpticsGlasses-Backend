const express = require("express");
const router = express.Router();
const {
  loginAdminController,
  logoutAdminController,
  changePasswordController,
  forgotPasswordController,
  getAdminProfileController,
} = require("../controllers/adminController");
const { verifyToken, verifyAdminToken } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/admin/login
 * @desc    Login admin and set cookie
 * @access  Public
 */
router.post("/login", loginAdminController);

/**
 * @route   POST /api/admin/logout
 * @desc    Logout admin and clear cookie
 * @access  Private
 */
router.post("/logout", verifyAdminToken, logoutAdminController);

/**
 * @route   POST /api/admin/forgot-password
 * @desc    Request password reset link
 * @access  Public
 */
router.post("/forgot-password", forgotPasswordController);

/**
 * @route   PUT /api/admin/change-password
 * @desc    Change admin password
 * @access  Private (Requires valid JWT)
 */
router.put("/change-password", verifyAdminToken, changePasswordController);

/**
 * @route   GET /api/admin/me
 * @desc    Get current admin profile & verify auth
 * @access  Private (Admin)
 */
router.get("/me", verifyAdminToken, getAdminProfileController);

module.exports = router;
