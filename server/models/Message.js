var mongoose = require('mongoose');
// Message Schema
var messageSchema = mongoose.Schema({
  _id: {type:String},
  startedDatetime: {type:Date, required:'{PATH} is required!'},
  action: {type: mongoose.Schema.Types.ObjectId, ref: 'Action'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  comment: {type:String, required:'{PATH} is required!'}
});
var Message = mongoose.model('Message', messageSchema);

function createDefaultMessages() {
  Message.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      Message.create({startedDatetime: new Date('10/5/2013'), byUsername: 'usereee', comment: 'commenteee'});
    }
  });
}

exports.createDefaultMessages = createDefaultMessages;