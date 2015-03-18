var User = require('mongoose').model('User'),
  encrypt = require('../utilities/encryption.js');
// get users and populate current actions
exports.getUsers = function(req, res) {
  User.find({})
    .exec(function(err, collection) {
    res.send(collection);
  });
};
// create user, set the data, encrypt password response err or user
exports.createUser = function(io) {
  return function(req, res, next) {
    var userData = req.body;
    userData.email = userData.email.toLowerCase();
    userData.username = userData.username.toLowerCase();
    userData.image = userData.image;
    userData.story = userData.story;
    userData.salt = encrypt.createSalt();
    userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
    
    User.create(userData, function(err, user) {
      if(err) {
        if(err.toString().indexOf('E11000') > -1) {
          err = new Error('Duplicate username / email');
        }
        res.status(400);
        return res.send({reason:err.toString()});
      }
      req.logIn(user, function(err) {
        if(err) {return next(err);}
        io.emit('getCurrentUser', user);
        res.send(user);
      });
    });
  };
};
// update user
exports.updateUser = function(io) {
  return function(req, res) {
    var userUpdates = req.body;
    
    if(req.user._id != userUpdates._id && !req.user.hasRole('admin')) {
      res.status(403);
      return res.end();
    }
    req.user.username = userUpdates.username.toLowerCase();
    req.user.email = userUpdates.email.toLowerCase();
    req.user.firstName = userUpdates.firstName;
    req.user.lastName = userUpdates.lastName;
    req.user.image = userUpdates.image;
    req.user.story = userUpdates.story;
    req.user.location = userUpdates.location;
    if(userUpdates.password && userUpdates.password.length > 0) {
      req.user.salt = encrypt.createSalt();
      req.user.hashed_pwd = encrypt.hashPwd(req.user.salt, userUpdates.password);
    }
    req.user.save(function(err) {
      if(err) { 
        res.status(400); 
        return res.send({reason:err.toString()});
      }
      io.emit('getCurrentUser', req.user);
      res.send(req.user);
    });
  };
};
