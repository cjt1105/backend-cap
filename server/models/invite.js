const mongoose = require('mongoose')

const Invite = mongoose.model('invites', {
    fromName: String,
    toName: String,
    fromId: Number,
    toId: Number,
    accountId: String
})

module.exports = Invite