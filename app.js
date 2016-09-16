const express = require('express');
const app = express();
const { connect } = require('./middlewares/config/db');
const session = require('express-session')
const router = require('./controllers/routes.js');
const passport = require('passport')


app.set('view engine', 'pug');

app.use(passport.initialize());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use(router)



connect()
.then(()=>{
    app.listen(3000);
    console.log('listening')
})