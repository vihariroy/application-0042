var passport = require('passport');
// Authenticate user with passport local, be sure that user isnt duplicate with lowercase
// return success true or false to client
exports.authenticate = function(io) {
  return function(req, res, next) {
    req.body.username = req.body.username.toLowerCase();
    var auth = passport.authenticate('local', function(err, user) {
      if(err) {return next(err);}
      if(!user) { res.send({success:false})}
      req.logIn(user, function(err) {
        if(err) {return next(err);}
        io.emit('getCurrentUser', user);
        res.send({success:true, user: user});
      });
    });
    auth(req, res, next);
  };
};
// Logged in if authenticated
exports.requiresApiLogin = function(req, res, next) {
  if(!req.isAuthenticated()) {
    res.status(403);
    res.end();
  } else {
    next();
  }
};
// Open if admin role
exports.requiresRole = function(role) {
  return function(req, res, next) {
    if(!req.isAuthenticated() || req.user.roles.indexOf(role) === -1) {
      res.status(403);
      res.end();
    } else {
      next();
    }
  };
};