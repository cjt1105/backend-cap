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
        enableProof: config.facebookAuth.enableProof,
        profileFields: ['id', 'displayName', 'photos', 'friends'],
        scope: ['user_friends']
    },
    (accessToken, refreshToken, profile, cb) => {
        // console.log(profile)
        User.findOne({id: profile.id}, (err, user) => {
            if (user) {
                return cb(null, user)
            } else {
                let newUser = {
                    id: profile.id,
                    name: profile.displayName,
                    picture: profile.photos[0].value,
                    access_token: accessToken
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