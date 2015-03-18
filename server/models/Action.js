var mongoose = require('mongoose');
// Action Schema
var actionSchema = mongoose.Schema({
  _id: {type:String},
  actionName: {type:String, required:'{PATH} is required!'},
  timeSpent: {type:Number, required:'{PATH} is required!'},
  moneySpent: {type:Number, required:'{PATH} is required!'},
  startedDatetime: {type:Date, required:'{PATH} is required!'},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}], // Looking for specified message
  location: {type:String, required:'{PATH} is required'},
  story: {type:String},
  image: {type:String},
  repeat: {type:Number},
  completed: {type:Boolean},
  private: {type:Boolean},
  isMessaged: [String],
  updatedAt: {type:Date, required:'{PATH} is required!'},
  creator: {type:String, required:'{PATH} is required'},
  repeatedNumber: {type:Number}
});
var Action = mongoose.model('Action', actionSchema);

function createDefaultActions() {
  Action.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      Action.create({actionName: 'Lorem Ipsum is simply', timeSpent: '234', moneySpent: '123', startedDatetime: new Date('10/5/2013'), forUsername: 'asd', byUsername: 'qwe', distanceTraveled: '777'});
    }
  });
}

exports.createDefaultActions = createDefaultActions;