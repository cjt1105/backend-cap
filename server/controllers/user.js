'use strict'

const { User } = require('../models/user.js')
const Account = require('../models/account')

module.exports.fetchAccounts = (req, res) => {
    const id = req.session.passport.user.id;
    Account.find({
        owner: id
    })
    .then(accounts => res.json(200, accounts))
}

module.exports.fetchUserInfo = (req, res) => {
    const conditions = {
        id: req.session.passport.user.id
    }
    User.findOne(conditions)
    .then(user => res.json(200, user))
}

module.exports.fetchSingleAccount = (req, res) => {
    const accountId = req.params.id;
    const uid = req.session.passport.user.id
    let canAccess = false
    Account.findOne({_id: accountId})
    .then((account) => {
        if(account.owner.toString() === uid.toString()){
            canAccess = true;
            res.json(account)
        } else {
            if(account.canAccess.length > 0){
                account.canAccess.forEach(item => {
                    if(item.toString() === uid.toString()){
                        res.json(account)
                    }
                })
            } else {
                res.json({message: null})
            }
        }
    })
}