const paymentMethodServices = require("../services/paymentMethodServices");

const getAllPaymentMethodsController = async (req, res) => {
    try {
        const methods = await paymentMethodServices.getAllPaymentMethods();
        res.status(200).json({
            isStatus: true,
            msg: "Payment methods retrieved successfully",
            data: methods,
        });
    } catch (error) {
        res.status(500).json({
            isStatus: false,
            msg: error.message || "Internal Server Error",
            data: null,
        });
    }
};

const createPaymentMethodController = async (req, res) => {
    try {
        const method = await paymentMethodServices.createPaymentMethod(req.body);
        res.status(201).json({
            isStatus: true,
            msg: "Payment method created successfully",
            data: method,
        });
    } catch (error) {
        res.status(400).json({
            isStatus: false,
            msg: error.message || "Bad Request",
            data: null,
        });
    }
};

const updatePaymentMethodController = async (req, res) => {
    try {
        const method = await paymentMethodServices.updatePaymentMethod(req.params.id, req.body);
        res.status(200).json({
            isStatus: true,
            msg: "Payment method updated successfully",
            data: method,
        });
    } catch (error) {
        res.status(400).json({
            isStatus: false,
            msg: error.message || "Bad Request",
            data: null,
        });
    }
};

const deletePaymentMethodController = async (req, res) => {
    try {
        await paymentMethodServices.deletePaymentMethod(req.params.id);
        res.status(200).json({
            isStatus: true,
            msg: "Payment method deleted successfully",
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            isStatus: false,
            msg: error.message || "Bad Request",
            data: null,
        });
    }
};

module.exports = {
    getAllPaymentMethodsController,
    createPaymentMethodController,
    updatePaymentMethodController,
    deletePaymentMethodController,
};
