const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productId: { type: String, required: true },
    image: { type: Buffer },
    name: { type: String, required: true },
    unitType: { type: String, required: true },
    gsnCode: { type: String, required: true },
    basicCost: { type: String, required: true },
    gstPercentage: { type: String, required: true },
    gst: { type: String, required: true },
    transportation: { type: String, required: true },
    profitPercentage: { type: String, required: true },
    profit: { type: String, required: true },
    plan1Five: { type: String, required: true },
    plan2Pecentage: { type: String, required: true },
    plan3Award: { type: String, required: true },
    plan4Insurance: { type: String },
    plan5Director: { type: String, required: true },
    totalCost: { type: String, required: true },
    saleCost: { type: String, required: true },
    netIncome: { type: String, required: true },
    mrp: { type: String, required: true },
    creationDate: {type: Date, required: true},
    updatedDate: {type: Date, required: true},
    active: {type: Boolean, required: true},
    productCategory: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);