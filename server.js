const express = require('express');
const app = express();
const { connect } = require('./server/middlewares/config/db');
const session = require('express-session')
const router = require('./server/routes/routes.js');
const passport = require('passport');
const { json } = require('body-parser');
const RedisStore = require('connect-redis')(session)

const port = process.env.PORT || 3000;

// app.set('view engine', 'pug');

app.use(express.static('client'))
app.use(passport.initialize());
app.use(json())
app.use(session({
    secret: 'keyboard cat',
    cookie: {secure: false},
    store: new RedisStore({
    url:  'redis://redistogo:1136da6a4e2373b0922e8bc2dc4debe8@sculpin.redistogo.com:10579/
',
    resave: true,
    saveUninitialized: true
  })
}))
app.use(router)



connect()
.then(()=>{
    app.listen(port);
    console.log('listening')
})

