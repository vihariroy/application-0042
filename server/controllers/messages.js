var Message = require('mongoose').model('Message');
var User = require('mongoose').model('User');
var Action = require('mongoose').model('Action');
var mongoose = require('mongoose');
// MESSAGES
// get all messages
exports.getMessages = function(req, res) {
  Message.find({})
    .populate('action')
    .populate('user')
    .exec(function(err, messages) {
    res.send(messages);
  });
};

// set message data and create new message
exports.createMessage = function(io) {
  return function(req, res, next) {
    var messageData = {
      _id : mongoose.Types.ObjectId(),
      startedDatetime : req.body.startedDatetime,
      comment : req.body.comment,
      user: req.user._id,
      action: req.body.action
    };
    
    Message.create(messageData, function(err, message) {
      if(err) {
        res.status(400);
        return res.send({reason:err.toString()});
      }
      Action.findOne({_id:message.action})
        .exec(function(err, action) {
          if(err) {
            res.send(err);
          }
          io.emit('createCachedMessage', {message:message, action:action, user:req.user});
          action.messages.push(message._id);
          action.isMessaged.push(req.user._id);
          action.updatedAt = messageData.startedDatetime;
          action.save(function(err) {
            if(err) { 
              res.status(400);
              return res.send({reason:err.toString()});
            }
          });
          User.find({$or: [
            {$and:
              [
                {'_id': {$in:action.isMessaged}},
                {'_id': {$ne:req.user._id}}
              ]
            },
            {$and: 
              [
                {'_id': action.user},
                {'_id': {$ne:req.user._id}}
              ]
            }
          ]})
            .exec(function(err, users) {
              if(err) {
                res.status(400);
                res.send({reason:err.toString()});
              }
              users.forEach(function(user) {
                if(user !== null) {
                  if(user.notification === undefined) {
                    user.notification = 0;
                  }
                  user.notification = user.notification + 1;
                  user.save(function(err) {
                    if(err) {
                      res.status(400);
                      return res.send({reason:err.toString()});
                    }
                  });
                  io.emit('notification', user);
                }
              });
            });
      });
      req.user.messages.push(message);
      req.user.save(function(err, user) {
        if(err) {
          res.send(err);
        }
      });
      res.send(message);
    });
  };
};
