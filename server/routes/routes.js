const { Router } = require('express');
const router = Router();
const passport = require('passport')
const config = require('../middlewares/config/passport')(passport);
const AccountInfo = require('../models/account.info');
const Account = require('../models/account');
const { User } = require('../models/user')
const auth = require('../middlewares/config/auth.js');
const graph = require('fbgraph');
const { getDate , shouldExchange } = require('../helpers/date')
const request = require('request')
const Invite = require('../models/invite');
const stripe = require('stripe')('sk_test_ZaWMUUXlFjKGoG4VyftGyCQ9')
const timestamp = require('unix-timestamp')


router.get('/', (req, res) => {
    console.log(req.session)
})


router.get('/session', (req,res) => {
   
})

router.get('/login/facebook', passport.authenticate('facebook', { scope : ['user_friends', 'publish_actions'] }))

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }))

router.get('/api/user/info', (req, res) => {
    console.log(req.session.passport.user.id)
    const conditions = {
        id: req.session.passport.user.id
    }
    User.findOne(conditions)
    .then(user => res.json(user))
})

router.get('/api/user/accounts', ( req, res) => {
    const id = req.session.passport.user.id;
    Account.find({
        owner: id
    })
    .then(accounts => res.json(accounts))
})

router.get('/accounts/populate', (req,res) => {
    AccountInfo.find()
    .then(accounts => {
        // fetch accounts and map them to only include name and price
        const mappedAccounts = accounts.map((index)=> {
            return { name: index.name, price: index.price}
        })
        res.json(mappedAccounts)
    })
})

router.post('/accounts/add', (req,res) => {
    const planId = `${req.body.name}_${req.session.passport.user.id}`
    req.body.owner = req.session.passport.user.id.toString();
    req.body.plan = planId;
    Account.create(req.body)
    .then(account => {
        let stripeId;
        User.findOne({id: req.session.passport.user.id})
        .then(user => {
            stripeId = user.stripeId
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
                console.log(plan)
            }
        })
        })
    })
    res.end()
})

router.get('/api/user/accounts/:id', (req, res) => {
    const accountId = req.params.id;
    console.log(accountId)
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
})

router.get('/logout', (req,res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/')
})

/// browse routes

router.get('/me', (req,res) => {
    request(`https://graph.facebook.com/me/friends?access_token=${req.session.passport.user.access_token}`, (err, response, body) => {
       res.send(body)
    })
})

router.get('/api/accounts/invite/:id', (req,res) => {
    Account.findOne({_id: req.params.id})
    .then(account => {
        const response = {name: account.name, owner: account.owner, plan: account.plan}
        res.json(response)
    })
})

router.patch('/api/accounts/addUser', (req,res) => {
    const conditions ={
        _id: req.body.accountId
    }

    Account.update(conditions, {$addToSet: { canAccess: req.body.userToAdd}})
    .then(account => {
        Account.update(conditions, { $inc: { users: 1}})
        .then((_account) => {
            res.send(200)
        })
    })

})

router.post('/api/invites', (req,res) => {
    const fromId = req.session.passport.user.id
    const invite = {
        fromId: fromId.toString(),
        fromName: req.session.passport.user.name,
        toId: req.body.toId,
        accountId: req.body.accountId,
        planId: req.body.planId
    }
    console.log(invite)
    Invite.create(invite)
    .then(_invite => res.end())

})

router.get('/api/invites', (req,res) => {
    Invite.find({
        toId: req.session.passport.user.id
    })
    .then(invites => res.json(invites))
})

router.post('/api/stripe/createUser', (req,res) => {
    console.log(req.body)
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
            // req.body.external_account = customer.default_source
            stripe.tokens.create({card: customer.default_source })
            updates.customerId = customer.id

            stripe.accounts.create(req.body, (err, account) => {
                if(err) {
                    console.log(err)
                }
                console.log(account)
                updates.stripeId = account.id
                console.log(updates)
                User.update(conditions,updates)
                .then(_user => console.log('mongo', _user))
        })
    })
    res.end()
})

router.post('/api/accounts/subscribeUser', (req,res) => {
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
                    // console.log('timestamp!!!!', Math.floor(timestamp.now() + 15 ))
                    stripe.subscriptions.create({
                        customer: `${customer.id}`,
                        plan: `${req.body.planId}`
                    }, {stripe_account: req.session.passport.user.stripeId}, (err, subscription) => {
                        if(err) {
                            console.log(err)
                        }
                        // console.log(subscription)
                        res.end()
                    })
                }
            })
        })
    })
})

router.post('/stripe/events', (req, res) => {
    // console.log('event_hoe!!!', req.body)
    if(req.body.type === 'customer.subscription.created'){
        const subscriptionId = req.body.data.object.id
        const stripeUser = req.body.user_id
        // const planId = req.body.data.object.plan.id
        stripe.subscriptions.update(
            `${subscriptionId}`,
            { trial_end: Math.round(+new Date()/1000)-17900 },
            { stripe_account: stripeUser },
            (err, subscription) => {
                if(err) {
                    console.log(err)
                } else {
                    // console.log(subscription)
                }
            }
        )
    }
    if(req.body.type === 'invoice.created' && req.body.data.object.closed=== false){
        const invoiceId = req.body.data.object.id
        const invoicePrice = req.body.data.object.amount_due
        const planId = req.body.data.object.lines.data.plan.id
        const conditions = { plan: planId}
        const customer = req.body.data.object.customer
        const stripeUser = req.body.user_id
        // console.log(stripeUser)
         Account.findOne(conditions)
        .then((account) => {
            const adjustedPrice = Math.floor((account.price/account.users) * 100)
            if(invoicePrice === adjustedPrice){
                res.send(200)
            } else {
                const creditToAdd = adjustedPrice - invoicePrice;
                console.log("credit!!!!", creditToAdd)
                    stripe.invoiceItems.create({
                        customer: customer,
                        amount: creditToAdd,
                        currency: 'usd'
                    }, {stripe_account: stripeUser },(err, item) => {
                        if(err){
                            console.log(err)
                        }
                        res.send(200)
                    })
            }
        })
    }
    else {
        res.send(200)
    }
})

  module.exports = router;