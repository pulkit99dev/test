const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

passport.use(
  new googleStrategy(
    {
      clientID:
        "696495007797-a5hqfqda2oq254egjp2ornavl9kdn2u0.apps.googleusercontent.com",
      clientSecret: "B7zvSg9xL3QY6LsjIqUINWnG",
      callbackURL: "http://localhost:8000/user/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("error in google strategy-passport", err);
          return;
        }
        console.log(profile);
        if (user) {
          return done(null, user);
        } else {
          User.create(
            {
              name: profile.display,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log("error in creating user", err);
                return;
              }
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
