var mongoose = require('mongoose'),
  encrypt = require('../utilities/encryption');
// User Schema
var userSchema = mongoose.Schema({
  firstName: {type:String},
  lastName: {type:String},
  image: {type:String},
  story: {type:String},
  username: {
    type: String,
    required: '{PATH} is required!',
    unique:true
  },
  email: {
    type: String,
    required: '{PATH} is required!',
    unique:true
  },
  salt: {type:String, required:'{PATH} is required!'},
  hashed_pwd: {type:String, required:'{PATH} is required!'},
  location: {type:String},
  roles: [String],
  notification: {type:Number},
  actions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Action'}],// Looking for specified action
  messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}] // Looking for specified message
});
userSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};
var User = mongoose.model('User', userSchema);

// Create default users
function createDefaultUsers() {
  User.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      var salt, hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'admin');
      User.create({firstName:'admin',lastName:'admin',username:'admin', email:'admin@admin.com', salt: salt, hashed_pwd: hash, roles: ['admin']});
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'jones');
      User.create({firstName:'Nikola',lastName:'Lukic',username:'jones', email:'jones@jones.rs', salt: salt, hashed_pwd: hash, roles: []});
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'dajk');
      User.create({firstName:'Radovan',lastName:'Hajdukovic',username:'dajk', email:'dajk@dajk.rs', salt: salt, hashed_pwd: hash});
    }
  });
}

exports.createDefaultUsers = createDefaultUsers;
