var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res, next) {
  res.render('index', { title: 'Members' });
});


//restrict members page
function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()){
    //logged in
    return next();
  }

  //Not logged in
  res.redirect('/users/login');
}

module.exports = router;
