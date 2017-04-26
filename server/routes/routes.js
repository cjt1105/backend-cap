const { Router } = require('express');
const router = Router();
const passport = require('passport')
const config = require('../middlewares/config/passport')(passport);
const auth = require('../middlewares/config/auth.js');
const graph = require('fbgraph');
const { getDate , shouldExchange } = require('../helpers/date')
const request = require('request')
const Invite = require('../models/invite');
const stripe = require('stripe')('sk_test_ZaWMUUXlFjKGoG4VyftGyCQ9')
const timestamp = require('unix-timestamp')
const Account = require('../models/account');
const { User } = require('../models/user')
const Users = require('../controllers/user.js')

//imports
const Accounts = require('../controllers/account.js')
const  Invites  = require('../controllers/invite.js')

router.get('/loggedIn', (req,res) => {
    if(req.session.passport != undefined || null) {
        res.send(200, {result: true})
    } else {
        res.send(200, {result: false})
    }
})

//Auth routes
router.get('/login/facebook', passport.authenticate('facebook', { scope : ['user_friends', 'publish_actions'], display: 'popup' }))

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }))

// User routes
router.get('/api/user/info', Users.fetchUserInfo)

router.get('/api/user/accounts', Users.fetchAccounts )

router.get('/api/subscriptions', Users.fetchSubcriptions)

//Account routes
router.get('/accounts/populate', Accounts.populate )

router.post('/accounts/add', Accounts.add )



router.get('/api/user/accounts/:id', Users.fetchSingleAccount)

router.get('/logout', (req,res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/')
})

router.get('/api/accounts/invite/:id', Invites.fetchOne )

router.patch('/api/accounts/addUser', Accounts.addUser )

router.post('api/deleteInvite', Invites.delete )

router.post('/api/invites', Invites.add )

router.get('/api/invites', Invites.fetchAll )

router.post('/api/stripe/createUser', Users.createStripeUser )

router.post('/api/accounts/subscribeUser', Accounts.subscribeUser )

router.get('/delete/:stripeId', (req,res) => {
    const stripeId = req.params.stripeId
    stripe.accounts.del({stripeId})
})

router.post('/stripe/events', (req, res) => {
    if(req.body.type === 'invoiceItem.created'){
        console.log(req.body)
        res.send(200)
    }

    if(req.body.type === 'customer.subscription.created'){
        const subscriptionId = req.body.data.object.id
        const stripeUser = req.body.user_id
        const startTime = req.body.data.object.trial_start
        stripe.subscriptions.update(
            `${subscriptionId}`,
            { trial_end: startTime + 30 },
            { stripe_account: stripeUser },
            (err, subscription) => {
                if(err) {
                    console.log(err)
                } else {
                    res.send(200)
                }
            }
        )
    }
    if(req.body.type === 'invoice.created' && req.body.data.object.closed=== false){
        const invoiceId = req.body.data.object.id
        const invoicePrice = req.body.data.object.amount_due
        const planId = req.body.data.object.lines.data[0].plan.id || null
        const conditions = { plan: planId}
        const customer = req.body.data.object.customer
        const stripeUser = req.body.user_id
        if(planId != null) {
            Account.findOne(conditions)
            .then((account) => {
                const adjustedPrice = Math.floor((account.price/account.users) * 100)
                if(invoicePrice === adjustedPrice){
                    res.send(200)
                } else {
                    const creditToAdd = adjustedPrice - invoicePrice;
                    console.log("credit!!!!", adjustedPrice, invoicePrice)
                        stripe.invoiceItems.create({
                            customer: customer,
                            amount: creditToAdd,
                            currency: 'usd',
                            invoice: invoiceId
                        }, {stripe_account: stripeUser },(err, item) => {
                            if(err){
                                console.log(err)
                            }
                            console.log(item)
                            res.send(200)
                        })
                }
            })
        }
        else {
            console.log(req.body)
            res.send(200)
        }
    }
    if(req.body.type === 'invoice.created' && req.body.data.object.closed=== true){
        res.send(200)
    }
})

  module.exports = router;