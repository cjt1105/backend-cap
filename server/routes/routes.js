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

// router.get('/', (req, res) => {
//     if(req.session.passport != undefined){
//         res.redirect('/profile')
//     } else {
//         res.render('home')
//     }
   
// })

// router.get('/login', (req, res) => {
//     res.render('login')
// })

router.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }))

router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    User.findOne({
        id: req.session.passport.user.id
    })
    .then((user) => {
        
        graph.setAccessToken(user.access_token);
        graph.extendAccessToken({
        "client_id":      auth.facebookAuth.clientId
      , "client_secret":  auth.facebookAuth.clientSecret
    }, function (err, facebookRes) {
        const conditions = { id: req.session.passport.user.id }
        const newAccessToken = { $set: { access_token: facebookRes.access_token, token_exchanged: getDate}}
        User.update(conditions, newAccessToken)
        .then((user) => {
            console.log(user)
        })
    })
    })

    res.redirect('/profile')
  });


router.get('/profile', (req,res) => {
    let accounts = null;
    const user = req.session.passport.user
    const id = req.session.passport.user.id
    Account.find({
        owner: id
    })
    .then(_accounts => {
        accounts = _accounts
    })
    .then(() => {
        res.render('profile', {user: user, accounts: accounts})
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

/// browse routes

router.get('/browse', (req, res) => {
//   fb.getAuthResponse((response) => {
//       console.log(response)
//   })
    const id = req.session.passport.id
    // fb.api(`/${id}/friends`, (response) => {
    //     console.log(response)
    // })
    res.render('browse')
})

  module.exports = router;