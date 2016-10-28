const mongoose = require('mongoose');
//import findOrCreate and add it to user model
const UserSchema = new mongoose.Schema({
    name: String,
    id: String,
    picture: String,
    access_token: String,
    token_exchanged: Date,
    stripeId: String,
    customerId: String
})

module.exports.User = mongoose.model('users', UserSchema)