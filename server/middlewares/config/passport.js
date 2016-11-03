/// load user and passport strategies
const { Strategy } = require('passport-facebook');
const { User } = require('../../models/user');
const graph = require('fbgraph');
const { getDate , shouldExchange } = require('../../helpers/date')


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
        /// logic to see if access token should be exchanged, if so exchange it
        User.findOne({id: profile.id}, (err, user) => {
            if (user) {
                graph.setAccessToken(user.access_token)
                const currentDate = getDate();
                if(shouldExchange(currentDate)){
                    graph.extendAccessToken({
                        "client_id":      config.facebookAuth.clientId,
                        "client_secret":  config.facebookAuth.clientSecret
                    }, (err, facebookRes) => {
												const conditions = { id: profile.id }
												const newAccessToken = { $set: { access_token: facebookRes.access_token, token_exchanged: getDate()}}
												User.update(conditions, newAccessToken)
												.then((user) => {
														console.log(user)
												})
										})
                }
                return cb(null, user)
            } else {
                let newUser = {
                    id: profile.id,
                    name: profile.displayName,
                    picture: profile.photos[0].value,
                    access_token: accessToken,
					token_exchanged: getDate(),
                    card_added: false
                    }
                User.create(newUser, (err,user) => {
                    if (err) return handleError
                    else {
												graph.setAccessToken(user.accessToken)
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