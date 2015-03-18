var auth = require('./auth'),
  users = require('../controllers/users'),
  actions = require('../controllers/actions'),
  messages = require('../controllers/messages');

module.exports = function(app, io) {
  // USER
  app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
  // app.get('/api/users', users.getUsers);
  app.post('/api/users', users.createUser(io));
  app.put('/api/users', users.updateUser(io));
  //  ACTIONS
  app.get('/api/actions', actions.getActions);
  app.post('/api/actions', actions.createAction(io));
  app.get('/api/actions/:id', actions.getActionById);
  // app.put('/api/actions/all/:id', actions.updateAction(io));
  // app.get('/api/actions/:id/comment', actions.addComment);
  //  USER ACTIONS
  app.get('/api/my-actions', actions.getMyPrivateActions);
  // app.get('/api/my-actions/:id', actions.getMyActionById);
  app.get('/api/my-messaged-actions', actions.getMyMessagedActions(io));
  app.put('/api/actions/:id', actions.updateMyAction(io));
  
  app.delete('/api/actions/:id', actions.deleteMyAction(io));
  // MESSAGES
  app.get('/api/messages', messages.getMessages);
  app.post('/api/messages', messages.createMessage(io));
  // app.get('/api/messages/:id', messages.getMyMessageById);
  //  USER MESSAGES
  // app.get('/api/my-messages', messages.getMyMessages);
  // app.get('/api/my-messages/:id', messages.getMyMessageById);
  // app.put('/api/my-messages/:id', messages.updateMyMessage);
  // app.delete('/api/my-messages/:id', messages.deleteMyMessage);

  app.get('/partials/*', function(req, res) {
    res.render('../../public/app/' + req.params[0]);
  });

  app.post('/login', auth.authenticate(io));

  app.post('/logout', function(req, res) {
      req.logout();
      res.end();
  });
  
  app.get('/api/*', function(req, res) {
    res.send(404);
  });
  // Bootstrapped user (current user)
  app.get('*', function(req, res) {
    res.render('index', {
      bootstrappedUser: req.user
    });
  });
  
};