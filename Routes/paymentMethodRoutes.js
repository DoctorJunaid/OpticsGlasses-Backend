const express = require("express");
const router = express.Router();
const {
    getAllPaymentMethodsController,
    createPaymentMethodController,
    updatePaymentMethodController,
    deletePaymentMethodController,
} = require("../controllers/paymentMethodController");
const { verifyToken, verifyAdminToken } = require("../middleware/authMiddleware");

/**
 * @route   GET /api/payment-methods
 * @desc    Get all enabled payment methods
 * @access  Public
 */
router.get("/", getAllPaymentMethodsController);

/**
 * @route   POST /api/payment-methods
 * @desc    Create a new payment method
 * @access  Private (Admin)
 */
router.post("/", verifyAdminToken, createPaymentMethodController);

/**
 * @route   PATCH /api/payment-methods/:id
 * @desc    Update a payment method
 * @access  Private (Admin)
 */
router.patch("/:id", verifyAdminToken, updatePaymentMethodController);

/**
 * @route   DELETE /api/payment-methods/:id
 * @desc    Delete a payment method
 * @access  Private (Admin)
 */
router.delete("/:id", verifyAdminToken, deletePaymentMethodController);

module.exports = router;
