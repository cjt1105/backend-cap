const mongoose = require('mongoose');
//import findOrCreate and add it to user model
const findOrCreate = require('mongoose-findorcreate');
const UserSchema = new mongoose.Schema({
    name: String,
    id: String,
    picture: String,
    accounts: []
})
UserSchema.plugin(findOrCreate)
module.exports.User = mongoose.model('users', UserSchema)