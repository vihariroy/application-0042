var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
// Mongo database server
module.exports = {
  development: {
    db: 'mongodb://localhost/0042',
    rootPath: rootPath,
    port: process.env.PORT || 3030
  },
  production: {
    // Add yours
    db: 'mongodb://username:password@something.com:post/0042',
    rootPath: rootPath,
    port: process.env.PORT || 80
  }
};