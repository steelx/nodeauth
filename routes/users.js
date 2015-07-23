/*
* Routes : /users/:___
* */

var express = require('express');
var router = express.Router();
var User = require('../models/User');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register.jade', {
    title: 'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login.jade', {
    title: 'Login'
  });
});


/* POST users/register */
router.post('/register', function(req, res, next) {
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  //check for file/image field
  var profileImageOriginalName,
  profileImageName,
  profileImageMime,
  profileImagePath,
  profileImageExt,
  profileImageSize;
  if (req.files.profileimage) {
    //image info
    profileImageOriginalName = req.files.profileimage.originalname;
    profileImageName = req.files.profileimage.name;
    profileImageMime = req.files.profileimage.mimetype;
    profileImagePath = req.files.profileimage.path;
    profileImageExt = req.files.profileimage.extension;
    profileImageSize = req.files.profileimage.size;
  } else {
    //no image
    profileImageName = 'noimage.png';
  }


  //Form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Both passwords should match').equals(password);

  //check errors
  var errors = req.validationErrors();
  if (errors) {
    res.render('register.jade', {
      errors: errors,
      title: 'Register',
      name: name,
      username: username,
      email: email,
      password: password,
      password2: password2
    });
  } else {
    //no errors - create user model
    var newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password,
      profileimage: profileImageName
    });

    //Create User
    User.createUser(newUser, function(err, user) {
      if (err) {
        throw err;//breaks here
      }

      console.log(user);
    });

    //Success message
    req.flash('success', 'You are now registered user and may login!');
    res.location('/');
    res.redirect('/');
  }

});//post register END








//passport authentication
//http://passportjs.org/docs/configure
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//passport Authentication middleware
//http://passportjs.org/docs/authenticate
passport.use(new LocalStrategy(
  function(username, password, done) {
    //query database
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;

      //If username does not match db
      if (!user) {
        console.log('Unknown User');
        return done(null, false, {message: 'Unknown User'});
      }

      //If username found, next check password
      User.comparePassword(password, user.password, function(err, isMatch) {
        if(err) throw err;
        if (isMatch) {
          console.log('password match');
          return done(null, user);
        } else {
          console.log('Invalid Password.');
          return done(null, false, {message: 'Invalid Password'});
        }
      });
    });
  }
));

//passport Authentication route
router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password!'}),
    function(req, res) {
      console.log('Authentication success');
      req.flash('success', 'You are now logged in');
      res.redirect('/');//members page
    }
);


router.get('/logout', function(req, res){
  req.logout();

  req.flash('info', 'You have successfully logged out')
  res.redirect('/users/login');

});

module.exports = router;
