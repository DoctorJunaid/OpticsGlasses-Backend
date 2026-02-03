const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["card", "wallet", "bank_transfer", "crypto", "cash", "other"],
            default: "card"
        },
        icon: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        isEnabled: {
            type: Boolean,
            default: true,
        },
        instructions: {
            type: String,
            trim: true,
        }
    },
    {
        timestamps: true,
        collection: "payment_methods",
    }
);

const PaymentMethod = mongoose.model("PaymentMethod", paymentMethodSchema);

module.exports = PaymentMethod;
