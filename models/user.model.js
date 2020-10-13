const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // image: { type: Buffer },
    name: { type: String, required: true },
    id: { type: String, required: true },
    // email: { type: String, required: true },
    mobile: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    fatherName: { type: String, required: true },
    // dob: { type: Date, required: true },
    gstNo: { type: String },
    pan: { type: String },
    // aadhaar: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    parentId: { type: String, required: true },
    childrenId: { type: Array},
    totalSale: {type: Number},
    monthlySale: {type: Object},
    totalSponsorIncome:{type: Number},
    monthlySponsorIncome:{type: Object},
    accountNumber: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    ifscCode: { type: String, required: true },
    createdOn: { type: Date, required: true },
    active: {type: Boolean, required: true}
});

module.exports = mongoose.model('User', userSchema);