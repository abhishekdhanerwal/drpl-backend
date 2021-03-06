const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    date: { type: Date, required: true },
    leaderId: { type: String, required: true },
    products: { type: Array, required: true },
    totalSaleCost: { type: Number, required: true },
    totalCgst: { type: Number, required: true },
    totalSgst: { type: Number },
    totalIgst: { type: Number },
    totalCost: { type: Number, required: true },
    orderId: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);