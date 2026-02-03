require("dotenv").config();
const mongoose = require("mongoose");
const PaymentMethod = require("./models/PaymentMethod");

const seedPaymentMethods = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Connected to DB...");

        const methods = [
            {
                name: "Credit/Debit Card",
                type: "card",
                icon: "credit-card",
                description: "Pay securely using your Visa, MasterCard, or American Express.",
                isEnabled: true
            },
            {
                name: "PayPal",
                type: "wallet",
                icon: "paypal",
                description: "Fast and secure checkout using your PayPal account.",
                isEnabled: true
            },
            {
                name: "Bank Transfer",
                type: "bank_transfer",
                icon: "bank",
                description: "Transfer funds directly from your bank account.",
                isEnabled: true,
                instructions: "Please use your Order Number as the reference. Your order will be shipped after funds clear."
            }
        ];

        // Delete existing ones to avoid duplicates during dev
        await PaymentMethod.deleteMany({});
        await PaymentMethod.insertMany(methods);

        console.log("Payment methods seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding payment methods:", error);
        process.exit(1);
    }
};

seedPaymentMethods();
