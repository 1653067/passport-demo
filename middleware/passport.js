let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let FacebookStrategy = require("passport-facebook").Strategy;
let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let models = require("../models");

passport.use(
  new LocalStrategy(function(username, password, done) {
    models.User.findOne({ where: { username: username } }).then(user => {
      if (!user) {
        return done(null, false);
      }
      if (!user.validPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: "1109461399256777",
      clientSecret: "e43981e91b566ae213af3b1f6ca1432a",
      callbackURL: "https://localhost:3000/login/fb/cb",
      profileFields: ["email", "gender", "locale", "displayName"]
    },
    (accessToken, refreshToken, profile, done) => {
      models.User.findOne({
        where: {username: profile._json.email}
      })
      .then((user) => {
        if(user) {
          return done(null, user);
        } else {
          models.User.create({
            username: profile._json.email
          }).then((user) => {
            return done(null, user);
          });
        }
      })
    }
  )
);

passport.use(new GoogleStrategy({
  clientID: '945368106119-lguombpjv54otsdftj8c8bsebmnd8sno.apps.googleusercontent.com',
  clientSecret: 'Tqa7_2CN8BBk1nYvsxdmKfBB',
  callbackURL: "https://localhost:3000/login/gg/cb"
},
function(token, tokenSecret, profile, done) {
  models.User.findOne({
    where: {username: profile.emails[0].value}
  })
  .then((user) => {
    if(user) {
      return done(null, user);
    } else {
      models.User.create({
        username: profile.emails[0].value
      }).then((user) => {
        return done(null, user);
      });
    }
  })
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
