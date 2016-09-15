const { Router } = require('express');
const router = Router();
const passport = require('passport')
const config = require('../middlewares/config/passport')(passport);

router.get('/', (req, res) => {
    res.render('home')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }))

router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    //   console.log(req.user)
    req.session.user = req.user;
    res.redirect('/profile')
  });

router.get('/logout', (req, res) => {
    // console.log(req.user)
    req.logout();
    res.redirect('/');
});

router.get('/profile', (req,res) => {
    console.log(req.session.user)
    res.render('profile')
})

  module.exports = router;