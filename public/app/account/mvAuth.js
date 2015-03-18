angular.module('app').factory('mvAuth', function($http, mySocket, $routeParams, mvIdentity, $q, mvUser, mvAction, mvMessage) {
  return {
    // Post the login and return auth promise, if success return true, else return false
    authenticateUser: function(username, password) {
      var dfd = $q.defer();
      $http.post('/login', {username:username, password:password}).then(function(response) {
        if(response.data.success) {
          var user = new mvUser();
          angular.extend(user, response.data.user);
          mvIdentity.currentUser = user;
          dfd.resolve(true);
        } else {
          dfd.resolve(false);
        }
      });
      return dfd.promise;
    },
    // Crete user, make new User and save him
    createUser: function(newUserData) {
      var newUser = new mvUser(newUserData);
      var dfd = $q.defer();

      newUser.$save().then(function() {
        mvIdentity.currentUser = newUser;
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });

      return dfd.promise;
    },
    // Update user, make a clone, extend new userdata and update him
    updateCurrentUser: function(newUserData) {
      var dfd = $q.defer();

      var clone = angular.copy(mvIdentity.currentUser);
      angular.extend(clone, newUserData);
      clone.$update().then(function() {
        mvIdentity.currentUser = clone;
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },
    // Logout user
    logoutUser: function() {
      var dfd = $q.defer();
      $http.post('/logout', {logout:true}).then(function() {
        mvIdentity.currentUser = undefined;
        dfd.resolve();
      });
      return dfd.promise;
    },
    // Authorize current user is available for some route (only admin role exist)
    authorizeCurrentUserForRoute: function(role) {
      if(mvIdentity.isAuthorized(role)) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    },
    // Authorize users authenticated users available for some route (only admin role exist)
    authorizeAuthenticatedUserForRoute: function() {
      if(mvIdentity.isAuthenticated()) {
        return true;
      } else {
        return $q.reject('not authorized');
      }
    },
    // Create action, make new action, post him to mvAction service
    createAction: function(newActionData) {
      var newAction = new mvAction(newActionData);
      var dfd = $q.defer();

      newAction.$save().then(function(data) {
        dfd.resolve(data);
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },
    // Update action, find and update particural action
    updateAction: function(newActionData, id) {
      var dfd = $q.defer();
      
      mvAction.query().$promise.then(function(collection) {
        collection.forEach(function(action) {
          if(action._id === id) {
            var clone = angular.copy(action);
            angular.extend(clone, newActionData);
            
            clone.$update({ id:action._id }).then(function() {
              dfd.resolve();
            }, function(response) {
              dfd.reject(response.data.reason);
            });
          }
        });
      });
      return dfd.promise;
    },
    // Delete action
    deleteAction: function(id) {
      var dfd = $q.defer();

      mvAction.query().$promise.then(function(collection) {
        collection.forEach(function(action) {
          if(action._id === id) {
            action.$delete({ id: action._id }).then(function() {
              dfd.resolve();
            }, function(response) {
              dfd.reject(response.data.reason);
            });
          }
        });
      });
      return dfd.promise;
    },
    // Play action, add new action data for particular action
    playAction: function(newActionPlayData) {
      var newAction = new mvAction(newActionPlayData);
      var dfd = $q.defer();

      newAction.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    },
    // Update complete action
    updateCompletedAction: function(newActionData) {
      var dfd = $q.defer();

      mvAction.query().$promise.then(function(collection) {
        collection.forEach(function(action) {
          if(action._id === newActionData._id) {
            var clone = angular.copy(action);
            angular.extend(clone, newActionData);
            clone.$update({ id:action._id }).then(function() {
              dfd.resolve();
            }, function(response) {
              dfd.reject(response.data.reason);
            });
          }
        });
      });
      return dfd.promise;
    },
    // Create repeat action if property repeat exist
    createRepeatedAction: function(newActionDataRepeat) {
      var newAction = new mvAction(newActionDataRepeat);
      var dfd = $q.defer();
      if(newActionDataRepeat.repeat > 0) {
        console.log(newAction);
        newAction.$save().then(function() {
          dfd.resolve();
        }, function(response) {
          dfd.reject(response.data.reason);
        });
      }
      return dfd.promise;
    },
  
    // Create action, make new action, post him to mvAction service
    createMessage: function(newMessageData, actionUserId) {
      var newMessage = new mvMessage(newMessageData);
      var dfd = $q.defer();

      newMessage.$save().then(function() {
        dfd.resolve();
      }, function(response) {
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    }
  };
});
