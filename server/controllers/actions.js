var Action = require('mongoose').model('Action');
var mongoose = require('mongoose');

// ACTIONS
// get all actions
exports.getActions = function(req, res) {
  Action.find() // {private: false} if we want to secure private
    .populate({
      path: 'user',
      select: 'username firstName lastName image story'
    })
    .populate('messages')
    .exec(function(err, actions) {
      if(err) {
        res.send(err);
      }
      var opts = {
        path: 'messages.user',
        select: 'username firstName lastName image story',
        model: 'User'
      };
      // Populate the populated message
      Action.populate(actions, opts, function(err, actions) {
        if(err) {
          res.send(err);
        }
        res.send(actions);
      });
  });
};

// set action data and create new action
exports.createAction = function(io) {
  return function(req, res, next) {
    var actionData = {
      _id: mongoose.Types.ObjectId(),
      actionName: req.body.actionName,
      timeSpent: req.body.timeSpent,
      moneySpent: req.body.moneySpent,
      user: req.user._id,
      repeat: req.body.repeat,
      location: req.body.location,
      story: req.body.story,
      startedDatetime: req.body.startedDatetime,
      image: req.body.image,
      completed: req.body.completed,
      private: req.body.private,
      updatedAt: req.body.updatedAt,
      creator: req.body.creator,
      repeatedNumber: req.body.repeatedNumber
    };
    
    Action.create(actionData, function(err, action) {
      if(err) {
        if(err.toString().indexOf('E11000') > -1) {
          err = new Error('Duplicate Actions');
        }
        res.status(400);
        return res.send({reason:err.toString()});
      }
      req.user.actions.push(action);
      req.user.save(function(err, user) {
        if(err) {
          res.send(err);
        }
      });
      io.emit('createCachedAction', {action: action, user: req.user});
      res.send(action);
    });
    
    
    if(req.body.completed === false) {
      Action.findOne({_id:req.body.scheduledId})
        .exec(function(err, action) {
          // console.log(action);
          if(err) {
            res.send(err);
            return res.send({reason:err.toString()});
          }
          console.log(req.body.newRepeatedNumber)
          action.repeatedNumber = req.body.newRepeatedNumber + 1;
          action.save(function(err) {
            if(err) { 
              res.status(400); 
              return res.send({reason:err.toString()});
            } else {
              console.log(action);
              io.emit('updateRepeatAction', {action:action});
            }
          });
        });
    }
  };
};

// get one action
exports.getActionById = function(req, res) {
  console.log(req.params.id);
  Action.findOne({_id:req.params.id})
    .populate('user')
    .populate('messages')
    .exec(function(err, action) {
    res.send(action);
  });
};

// USER ACTIONS
// get my actions
exports.getMyPrivateActions = function(req, res) {
  Action.find({$and: [
    {user:req.user._id},
    {private: true}
  ]})
    .populate({
      path: 'user',
      select: 'username firstName lastName image story'
    })
    .populate('messages')
    .exec(function(err, actions) {
      if(err) {
        res.send(err);
      }
      var opts = {
        path: 'messages.user',
        select: 'username firstName lastName image story',
        model: 'User'
      };
      // Populate the populated message
      Action.populate(actions, opts, function(err, actions) {
        if(err) {
          res.send(err);
        }
        res.send(actions);
      });
  });
};

// get my one action
exports.getMyActionById = function(req, res) {
  Action.findOne({_id:req.params.id})
    .populate('user')
    .exec(function(err, action) {
      if(err) {
        res.send(err);
      }
      res.send(action);
    });
};

exports.getMyMessagedActions = function(io) {
  return function(req, res) {
    Action.find({$or: [{user: req.user._id}, {isMessaged: req.user._id}]})
      .exec(function(err, actions) {
        if(err) {
          res.send(err);
        }
        var myMessagedActions = [];
        actions.forEach(function(action) {
          action = {
            _id: action._id
          };
          myMessagedActions.push(action);
        });
        io.emit('myMessagedActions', {myMessagedActions:myMessagedActions, user:req.user});
        res.send(myMessagedActions);
      });
    };
};

// update my action
exports.updateMyAction = function(io) {
  return function(req, res) {
    Action.findOne({$and: [{user:req.user._id}, {_id:req.params.id}]})
      .exec(function(err, action) {
        if(err) {
          res.send(err);
          return res.send({reason:err.toString()});
        }
        if(!action) {
          var err = new Error('You are not authorized for edit this action!');
          res.status(400);
          return res.send({reason:err.toString()});
        } else {
          // action = req.body;
          action.actionName = req.body.actionName;
          action.timeSpent = req.body.timeSpent;
          action.moneySpent = req.body.moneySpent;
          action.startedDatetime = req.body.startedDatetime;
          action.user = req.user._id;
          action.repeat = req.body.repeat;
          action.location = req.body.location;
          action.image = req.body.image;
          action.private = req.body.private;
          action.completed = req.body.completed;
          action.updatedAt = req.body.updatedAt;
          action.repeatedNumber = req.body.repeatedNumber;
          action.save(function(err) {
            if(err) { 
              res.status(400); 
              return res.send({reason:err.toString()});
            } else {
              io.emit('updateCachedAction', {action:action, user:req.user});
              res.send(action);
            }
          });
        }
    });
  };
};

// delete my action
exports.deleteMyAction = function(io) {
  return function(req, res) {
    Action.remove({$and: [{user:req.user._id}, {_id:req.params.id}]})
      .exec(function(err, action) {
        if(err) {
          res.send(err);
          return res.send({reason:err.toString()});
        } else if(!action) {
          var err = new Error('You are not authorized for delete this action!');
          res.status(400);
          return res.send({reason:err.toString()});
        } else {
          io.emit('deleteCachedAction', req.params.id);
          res.send('Successfully deleted!');
        }
      });
  };
};
