/// load user and passport strategies
const { Strategy } = require('passport-facebook');
const { User } = require('../../models/user');


// load auth config
const config = require('./auth')

module.exports = (passport) => {
    //define facebook strategy
    passport.use( new Strategy({
        clientID: config.facebookAuth.clientId,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: config.facebookAuth.callbackUrl,
        enableProof: config.facebookAuth.enableProof
    },
    (accessToken, refreshToken, profile, cb) => {
        User.find({id: profile.id}, (user, err) => {
            if (user) {
                return cb(null, user)
            } else {
                let newUser = {
                    id: profile.id,
                    name: profile.displayName,
                    picture: `https ://scontent-b-hkg.xx.fbcdn.net/hphotos-prn2/t1.0-9/1322_${profile.id}_298175508_n.jpg`
                    }
                User.create(newUser, (err,user) => {
                    if (err) return handleError
                    else {
                        return cb(null,user)
                    }
                })
            }
        });
    }
    ))

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
    })

}