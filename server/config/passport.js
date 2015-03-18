var passport = require('passport'),
  mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  User = mongoose.model('User');
  Action = mongoose.model('Action');
  Message = mongoose.model('Message');
// Local strategy
module.exports = function() {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      // Login with email or username
      User.findOne({$or:[{email:username},{username:username}]}).exec(function(err, user) {
        if(user && user.authenticate(password)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    if(user) {
      done(null, user._id);
    }
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({_id:id})
    .populate('actions')
    .populate('messages')
    .exec(function(err, user) {
      if(user) {
        var opts = {
          path: 'messages.action',
          model: 'Action'
        }
        User.populate(user, opts, function(err, user) {
          if(user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    });
  });

};