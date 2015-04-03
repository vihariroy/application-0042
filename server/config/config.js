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
    db: 'mongodb://giving:0042@ds061767.mongolab.com:61767/0042',
    rootPath: rootPath,
    port: process.env.PORT || 80
  }
};