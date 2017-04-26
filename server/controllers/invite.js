"use strict"
const Invite = require('../models/invite.js')
const Account = require('../models/account.js')

module.exports.add = (req, res) => {
    const fromId = req.session.passport.user.id
    const invite = {
        fromId: fromId.toString(),
        fromName: req.session.passport.user.name,
        fromPicture: req.session.passport.user.picture,
        toId: req.body.toId,
        accountId: req.body.accountId,
        planId: req.body.planId
    }
    console.log(invite)
    Invite.create(invite)
    .then(_invite => res.end())
}

module.exports.fetchOne = (req,res) => {
    Account.findOne({_id: req.params.id})
    .then(account => {
        console.log(account)
        const response = {_id: account._id, name: account.name, owner: account.owner, plan: account.plan, price: (account.price/(account.users + 1)).toFixed(2)}
        res.json(response)
    })
}

module.exports.delete = (req,res) => {
    const inviteId = req.inviteId
    Invite.findOneAndRemove({_id: inviteId})
    .then(() => {
        const conditions = {toId: req.session.passport.user.id}
        Invite.find(conditions)
        .then((invites) => {
            res.json(200, invites)
        })
    })
}

module.exports.fetchAll = (req,res) => {
    Invite.find({
        toId: req.session.passport.user.id
    })
    .then(invites => res.json(200, invites))
}


