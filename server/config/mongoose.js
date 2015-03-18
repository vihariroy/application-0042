var mongoose = require('mongoose'),
  userModel = require('../models/User'),
  actionModel = require('../models/Action'),
  messageModel = require('../models/Message');
  
// connecting to database
module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('0042 db opened');
  });

  userModel.createDefaultUsers();
  actionModel.createDefaultActions();
  messageModel.createDefaultMessages();
};