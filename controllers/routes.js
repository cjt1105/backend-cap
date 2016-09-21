const { Router } = require('express');
const router = Router();
const passport = require('passport')
const config = require('../middlewares/config/passport')(passport);
const AccountInfo = require('../models/account.info');
const Account = require('../models/account');
const User = require('../models/user')

router.get('/', (req, res) => {
    if(req.passport){
        console.log("haha", req.session.passport.user)
    }
    res.render('home')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }))

router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile')
  });


router.get('/profile', (req,res) => {
    let accounts = null;
    Account.find({
        owner: req.session.passport.user.id
    })
    .then(_accounts => {
        console.log("hey", _accounts)
        accounts = _accounts
    })
    .then(() => {
        res.render('profile', {user: req.user, accounts: accounts})
    })
})

router.get('/accounts/add', (req,res) => {
    AccountInfo.find()
    .then(accounts => {
        // fetch accounts and map them to only include name and price
        const mappedAccounts = accounts.map((index)=> {
            return { name: index.name, price: index.price}
        })
        res.render('addAccount', {accounts: mappedAccounts })
    })
})

router.post('/accounts/add', (req,res) => {
    const account = JSON.parse(req.body.account);
    let accountInfo = {
        name: account.name,
        email: req.body.email,
        password: req.body.password,
        owner: req.session.passport.user.id,
        price: account.price,
        canAccess: []
    }
    const newAccount = new Account(accountInfo);
    newAccount.save((err,acct) => {
        if (err) {
            res.send(err)
        } else {
            res.redirect('/profile')
        }
    })
    
})

router.get('/logout', (req,res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/')
})

  module.exports = router;