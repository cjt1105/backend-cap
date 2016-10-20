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


router.get('/', (req, res) => {
    console.log(req.session)
})


router.get('/session', (req,res) => {
    console.log(req.session.passport)
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
    req.body.owner = req.session.passport.user.id
    Account.create(req.body)
    .then(account => console.log(account))
})

router.get('/api/user/accounts/:id', (req, res) => {
    const accountId = req.params.id;
    Account.find({_id: accountId})
    .then((account) => res.json(account))
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

  module.exports = router;