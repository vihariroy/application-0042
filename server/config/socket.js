var User = require('mongoose').model('User');

module.exports = function(io) {
	io.on('connection', function(socket) {
		socket.on('resetNotifications', function(socket) {
		  User.findOne({_id:socket._id})
		    .exec(function(err, user) {
		      if(err) {
		        res.send(err);
		      }
		      user.notification = 0;
		      user.save(function(err) {
				    if(err) { 
				      console.log(err);
				    }
				  });
					io.emit('notificationReset', user);
		    });
		});
	});
};
