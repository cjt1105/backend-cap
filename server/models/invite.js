const mongoose = require('mongoose')

const Invite = mongoose.model('invites', {
    fromName: String,
    toName: String,
    fromId: Number,
    fromPicture: String,
    toId: Number,
    accountId: String,
    planId: String
})

module.exports = Invite