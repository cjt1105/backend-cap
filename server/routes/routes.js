const { Router } = require('express');
const router = Router();
const passport = require('passport')
const config = require('../middlewares/config/passport')(passport);
const auth = require('../middlewares/config/auth.js');
const stripe = require('stripe')('sk_test_ZaWMUUXlFjKGoG4VyftGyCQ9');
const Users = require('../controllers/user.js')
const Accounts = require('../controllers/account.js')
const  Invites  = require('../controllers/invite.js')
const Stripe = require('../controllers/stripe.js')

//Auth routes
router.get('/login/facebook', passport.authenticate('facebook', { scope : ['user_friends', 'publish_actions'], display: 'popup' }))

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }))

router.get('/logout', (req,res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/')
})

router.get('/loggedIn', (req,res) => {
    if(req.session.passport != undefined || null) {
        res.send(200, {result: true})
    } else {
        res.send(200, {result: false})
    }
})

// User routes
router.get('/api/user/info', Users.fetchUserInfo)

router.get('/api/user/accounts', Users.fetchAccounts )

router.get('/api/subscriptions', Users.fetchSubcriptions)

router.get('/api/user/accounts/:id', Users.fetchSingleAccount)

//Account routes
router.get('/accounts/populate', Accounts.populate )

router.post('/accounts/add', Accounts.create)

router.patch('/api/accounts/addUser', Accounts.addUser )

router.post('/api/accounts/subscribeUser', Accounts.subscribeUser )

// Invite routes

router.post('api/deleteInvite', Invites.delete )

router.post('/api/invites', Invites.add )

router.get('/api/invites', Invites.fetchAll )

router.get('/api/accounts/invite/:id', Invites.fetchOne )

router.post('/api/stripe/createUser', Users.createStripeUser )

router.get('/delete/:stripeId', (req,res) => {
    const stripeId = req.params.stripeId
    stripe.accounts.del({stripeId})
})

router.post('/stripe/events', Stripe.eventListener)

module.exports = router;