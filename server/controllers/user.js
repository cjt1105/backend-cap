'use strict'

const { User } = require('../models/user.js')
const Account = require('../models/account')
const stripe = require('stripe')('sk_test_ZaWMUUXlFjKGoG4VyftGyCQ9')

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

module.exports.fetchSubcriptions = (req, res) => {
    const conditions = {canAccess: req.session.passport.user.id.toString()}
    Account.find(conditions)
    .then((subscriptions) => {
        res.json(200, subscriptions)
    })
}

module.exports.createStripeUser = (req,res) => {
    /// grab token that was temporarily stored in tos_date and set date to correct value
    const token = req.body.tos_acceptance.date;
    req.body.tos_acceptance.date = Math.floor(Date.now() / 1000);
    req.body.tos_acceptance.ip = req.connection.remoteAddress;
    // create new account
        let updates = {};
        const conditions = {id: req.session.passport.user.id};
        stripe.customers.create({
            source: token,
            description: `${req.body.legal_entity.first_name} ${req.body.legal_entity.last_name}`
        }, (err, customer) => {
            if(err){
                console.log(err)
            }
            stripe.tokens.create({card: customer.default_source })
            updates.customerId = customer.id

            stripe.accounts.create(req.body, (err, account) => {
                if(err) {
                    console.log(err)
                }
                console.log(account)
                updates.stripeId = account.id
                updates.card_added = true
                User.update(conditions,updates)
                .then((user) => {
                    User.findOne(conditions)
                    .then((_user) => {
                        res.json(200,_user)
                    })
                })
        })
    })
}