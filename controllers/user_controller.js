let User = require("../models/user");
const jwt = require('jsonwebtoken');

module.exports.user = function (req, res) {
  User.findById(req.params.id, function (err, user) {
    return res.render("profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

module.exports.login = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }

  return res.render("login", {
    title: "User Login",
  });
};

module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/user/profile");
  }

  return res.render("signup", {
    title: "User Sign-up",
  });
};

// getting the sign-up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("Error in finding user while signing up");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("Error in creating user");
          return;
        }
        return res.redirect("/user/log-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};
//later

// module.exports.createSession = function (req, res) {
//   return res.redirect("/");
// };

module.exports.createSession = async function(req, res){
    
    try{
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.json(422, {
                message : 'Invalid Username or Password'
            })
        }
        return res.redirect('/')

        return res.json(200, {
            message : 'Successfully signed in',
            data : {
                token : jwt.sign(user.toJSON(), 'test', {expiresIn : '100000'})
            }
            
        })

        
    }catch(err){
        console.log('******', err);
        return res.json(500, {
            message : 'Internal Server error'
        });
    }
}


// log-out from session

module.exports.destroySession = function (req, res) {
  req.logout();

  return res.redirect("/");
};
