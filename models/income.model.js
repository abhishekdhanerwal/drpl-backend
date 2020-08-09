const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    date: {type: String, required: true},
    leaderId: { type: String, required: true },
    childrenId:{ type: String},
    purchasedAmount: {type: Number},
    sponsoredIncome: {type: Number},
    A: {type: Number},
    B: {type: Number},
    C: {type: Number},
    D: {type: Number}
});

module.exports = mongoose.model('Income', incomeSchema);