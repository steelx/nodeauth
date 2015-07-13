var express = require('express');
var router = express.Router();
var User = require('../models/User');

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


/* POST users */
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
    //no erros - create user model
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

});



module.exports = router;
