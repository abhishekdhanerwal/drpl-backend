const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
    date: {type: Date, required: true},
    productId: { type: String, required: true },
    purchasedStock: {type: Number},
    productSale: {type: Number},
    openingStock: {type:Number}
});

module.exports = mongoose.model('Stock', stockSchema);