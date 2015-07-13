var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');//bcryptjs MAC only

mongoose.connect('mongodb://localhost/nodeauth');
var db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  profileimage: {
    type: String
  },
});


//exports
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
  //newUser is instance of User object
  bcrypt.hash(newUser.password, 10, function(err, hash) {
    if (err) {
      throw err;
    }
    //Update password
    newUser.password = hash;
    //Create user
    newUser.save(callback);
  });
};
