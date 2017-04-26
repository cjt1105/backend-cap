'use strict'

const AccountInfo = require('../models/account.info');
const Account = require('../models/account');
const Invite = require('../models/invite.js')
const { User } = require('../models/user')
const stripe = require('stripe')('sk_test_ZaWMUUXlFjKGoG4VyftGyCQ9')

module.exports.populate = (req, res, next) => {
  AccountInfo.find()
  .then(accounts => {
      // fetch accounts and map them to only include name and price
      const mappedAccounts = accounts.map((index)=> {
          return { name: index.name, price: index.price}
      })
      res.json(mappedAccounts)
  })
}

module.exports.add = (req, res, next) => {
    const planId = `${req.body.name}_${req.session.passport.user.id}`
    req.body.owner = req.session.passport.user.id.toString();
    req.body.plan = planId;
    Account.create(req.body)
    .then(account => {
        let stripeId;
        User.findOne({id: req.session.passport.user.id})
        .then(user => {
            stripeId = user.stripeId
            console.log(stripeId)
        })
        .then(() => {
            let total = Math.round((account.price/2)*100)
            stripe.plans.create({
            amount: total,
            interval: "month",
            name: planId,
            id: planId,
            currency: 'usd',
            trial_period_days: 1,

        }, {stripe_account: stripeId}, (err,plan) => {
            if (err) {
                console.log(err)
            }
            else {
                res.sendStatus(200)
            }
        })
        })
    })
}

module.exports.addUser = (req,res) => {
    const conditions ={
        _id: req.body.accountId
    }
    const inviteId = req.body.id;
    console.log(inviteId)
    Account.update(conditions, {$addToSet: { canAccess: req.body.userToAdd}})
    .then(account => {
        Account.update(conditions, { $inc: { users: 1}})
        .then((_account) => {
            Account.update(conditions, {$addToSet: { contributors: {name: req.body.senderName, picture: req.body.picture}}})
            .then((updated_account) => {
                Invite.findOneAndRemove({_id: inviteId},(invite) => {
                    console.log(invite)
                })
            })
            res.send(200)
        })
    })
}

module.exports.subscribeUser = (req,res) => {
    User.findOne({id: req.body.senderId})
    .then(user => {
        stripe.tokens.create({
            customer: `${user.customerId}`
        },{stripe_account: req.session.passport.user.stripeId}, (err, token) => {
            if(err) {
                console.log(err)
            }
            stripe.customers.create({
                source: token.id,
                description: `${req.body.senderName}`
            },{stripe_account: req.session.passport.user.stripeId}, (err, customer) => {
                if(err) {
                    console.log(err)
                }
                else {
                    stripe.subscriptions.create({
                        customer: `${customer.id}`,
                        plan: `${req.body.planId}`
                    }, {stripe_account: req.session.passport.user.stripeId}, (err, subscription) => {
                        if(err) {
                            console.log(err)
                        }
                        res.send(200)
                    })
                }
            })
        })
    })
}
