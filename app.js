const express = require('express');
const app = express();
const { connect } = require('./middlewares/config/db');
const session = require('express-session')
const router = require('./controllers/routes.js');
const passport = require('passport');
const bodyParser = require('body-parser');
const RedisStore = require('connect-redis')(session)


app.set('view engine', 'pug');

app.use(express.static('public'))
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    secret: 'keyboard cat',
    cookie: {secure: false},
    store: new RedisStore({
    url:  'redis://localhost:6379'
  })
}))
app.use(router)



connect()
.then(()=>{
    app.listen(3000);
    console.log('listening')
})

