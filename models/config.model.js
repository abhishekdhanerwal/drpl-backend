const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const configSchema = new Schema({
    userId: {type: String},
    invoiceId: {type: String}

});

module.exports = mongoose.model('Config', configSchema, 'config');