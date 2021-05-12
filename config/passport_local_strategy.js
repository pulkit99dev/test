const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log(`Error in finding user`);
          return done(err);
        }
        if (!user || user.password != password) {
          console.log(`Invalid Username / Password`);
          return done(null, false);
        }

        return done(null, user);
      });
    }
  )
);

//Serialising (putting ids into cookies & encrypting it)
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserializing
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log(`Error in finding`);
      return done(err);
    }
    return done(null, user);
  });
});

// Check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in then pass on the request to the next function(controller's action)
  if (req.isAuthenticated()) {
    return next();
  }
  //if the user is not logged in
  return res.redirect("/user/log-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the details of the current signed in user we are just transferring it to the locals for the views
    res.locals.user = req.user;
  }
  next();
};

//if the user is already signed in then website shouldn't show the sign-in page
// passport.displaySignup = function(req, res, next){
//     if(req.isAuthenticated){
//         res.redirect('/user/profile');
//     }
//     next()
// }

module.exports = passport;
