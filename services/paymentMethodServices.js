const PaymentMethod = require("../models/PaymentMethod");

const getAllPaymentMethods = async () => {
    // Only return enabled payment methods
    return await PaymentMethod.find({ isEnabled: true });
};

const createPaymentMethod = async (data) => {
    return await PaymentMethod.create(data);
};

const updatePaymentMethod = async (id, data) => {
    const method = await PaymentMethod.findByIdAndUpdate(id, data, { new: true });
    if (!method) throw new Error("Payment method not found");
    return method;
};

const deletePaymentMethod = async (id) => {
    const method = await PaymentMethod.findByIdAndDelete(id);
    if (!method) throw new Error("Payment method not found");
    return method;
};

module.exports = {
    getAllPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
};
