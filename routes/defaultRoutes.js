const express = require('express');
const router = express.Router();
const {index, verifyAccountName, loginGet, loginPost, dashboard, logout} = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user').User;


// Home Route
router.get('/', index)

router.post('/verify-account', verifyAccountName)

// Defining Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, async(req, email, password, done) => {
  await User.findOne({ email: email }).then(async user => {
    
    if (!user) {
      return done(null, false, req.flash('error-message', 'User not found with this email.'));
      //  res.redirect('/login');
    }
    
    if (password != user.password){
    return done(null, false, req.flash('error-message', 'Password Incorrect'));

    }
    

    return done(null, user, req.flash('success-message', 'Login Successful'));
  });
}));



passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.route('/login')
  .get(loginGet)
  .post(passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
    session: true
  }));

router.get('/dashboard', dashboard)

router.get('/logout', logout);

module.exports = router;
// ================================================================================================