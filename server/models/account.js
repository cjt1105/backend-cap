const mongoose = require('mongoose');

const Account = mongoose.model('accounts', {
    name: String,
    email: String,
    password: String,
    owner: Number,
    price: Number,
    canAccess: [],
    users: Number
})

module.exports = Account;