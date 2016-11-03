const mongoose = require('mongoose');

const AccountInfoSchema = new mongoose.Schema({
    name: String,
    price: Number,
})

const AccountInfo = mongoose.model('accountinfo', AccountInfoSchema);

module.exports = AccountInfo;