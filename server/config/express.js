var express = require('express'),
  stylus = require('stylus'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  passport = require('passport');
// Compile stylus to css
module.exports = function(app, config) {
  function compile(str, path) {
    return stylus(str).set('filename', path);
  }
  app.set('views', config.rootPath + '/server/views');
  app.set('view engine', 'jade');
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '30mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({ resave: true,
    saveUninitialized: true,
    secret: 'giving aplication 0042'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(stylus.middleware(
    {
      src: config.rootPath + '/public',
      compile: compile
    }
  ));
  app.use(express.static(config.rootPath + '/public'));
};
