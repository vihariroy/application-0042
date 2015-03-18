angular.module('app').controller('appCtrl', function($scope, $modal, $timeout, mvNotifier, mySocket, $location, $timeout, mvIdentity, mvCachedActions, cachedMessages) {

  // Pre-Loading DATA
  $scope.identity = mvIdentity;
  $scope.actions = mvCachedActions.query();
  $scope.messages = cachedMessages.query();
  $scope.currentUser = mvIdentity.currentUser;

  // Pre-Loading screen
  $scope.loaded = false;  
  mvCachedActions.query().$promise.then(function() {
    $timeout(function() {
      $scope.loaded = true;
    }, 1000);
  });
  
  $scope.$on('logout', function(event, user) {
    $scope.currentUser = null;
  });
  
  // Update $scope.actions when create
  mySocket.on('createCachedAction', function(socket) {
    console.log('create: ', socket);
    var startedDatetime = Date.parse(socket.action.startedDatetime),
      updatedAt = Date.parse(socket.action.updatedAt);
    startedDatetime = new Date(startedDatetime);
    updatedAt = new Date(updatedAt);
    // console.log($scope.actions);
    $scope.actions.push({
      _id: socket.action._id,
      actionName: socket.action.actionName,
      timeSpent: socket.action.timeSpent,
      moneySpent: socket.action.moneySpent,
      startedDatetime: startedDatetime,
      repeat: socket.action.repeat,
      location: socket.action.location,
      story: socket.action.story,
      image: socket.action.image,
      user: socket.user,
      isMessaged: [],
      messages: [],
      completed: socket.action.completed,
      updatedAt: updatedAt,
      private: socket.action.private,
      creator: socket.action.creator,
      repeatedNumber: socket.action.repeatedNumber
    });
  });
  // Update $scope.actions when update
  mySocket.on('updateCachedAction', function(socket) {
    console.log('update: ', socket);
    $scope.actions.$promise.then(function(collection) {
      collection.forEach(function(action) {
        if(action._id === socket.action._id) {
          var index = collection.indexOf(action);
          collection[index] = {
            _id: socket.action._id,
            actionName: socket.action.actionName,
            timeSpent: socket.action.timeSpent,
            moneySpent: socket.action.moneySpent,
            startedDatetime: socket.action.startedDatetime,
            repeat: socket.action.repeat,
            location: socket.action.location,
            story: socket.action.story,
            image: socket.action.image,
            user: socket.user,
            isMessaged: [],
            message: [],
            completed: socket.action.completed,
            updatedAt: action.updatedAt,
            creator: socket.action.creator,
            repeatedNumber: socket.action.repeatedNumber
          };
        }
      });
    });
  });
  mySocket.on('updateRepeatAction', function(socket) {
    console.log(socket);
    $scope.actions.$promise.then(function(collection) {
      collection.forEach(function(action) {
        if(action._id === socket.action._id) {
          action.repeatedNumber = socket.action.repeatedNumber;
        }
      });
    });
  });
  // Update $scope.actions when delete
  mySocket.on('deleteCachedAction', function(socket) {
    $scope.actions.$promise.then(function(collection) {
      collection.forEach(function(action) {
        if(action._id === socket) {
          var index = collection.indexOf(action);
          $scope.actions.splice(index, 1);
        }
      });
    });
  });
  // Update $scope.actions when create
  mySocket.on('createCachedMessage', function(socket) {
    // console.log(socket);
      $scope.actions.$promise.then(function(collection) {
        collection.forEach(function(action) {
          if(action._id === socket.action._id) {
            var addMessage = {
              _id: socket.message._id,
              action: socket.action,
              comment: socket.message.comment,
              startedDatetime: socket.message.startedDatetime,
              user: socket.user
            };
            action.updatedAt = socket.action.updatedAt;
            action.messages.push(addMessage);
          }
        });
      });
  });
  
  // Load number of notifications if current user exist
  // and when loading page
  if(!!mvIdentity.currentUser) {
    $scope.badgeCount = mvIdentity.currentUser.notification;
  }

  // Load number of notifications when login
  $scope.$on('loginUser', function(event, user) {
    $scope.currentUser = user;
    $scope.badgeCount = user.notification;
  });
  
  // Load number of notifications when login
  $scope.$on('signupUser', function(event, user) {
    $scope.currentUser = user;
  });

  // Notification badge update
  mySocket.on('notification', function(socket) {
    // console.log(socket);
    if(mvIdentity.currentUser._id === socket._id) {
      $scope.badgeCount = socket.notification;
      if(socket.notification === 1) {
        mvNotifier.notify('You have ' + socket.notification + ' unread notification!');
      } else {
        mvNotifier.notify('You have ' + socket.notification + ' unread notifications!');
      }
    }
  });

  // Reset notifications from server/controllers/socket.js
  mySocket.on('notificationReset', function(socket) {
    console.log(socket);
    if(mvIdentity.currentUser._id === socket._id) {
      $scope.badgeCount = socket.notification;
    }
  });
  
  
  $scope.resetNotifications = function() {
    mySocket.emit('resetNotifications', mvIdentity.currentUser);
  };

  // Current Path
  $scope.currentPath = $location.path();
  // Toggle action state & icon
  $scope.toggleActionState = function() {
    if($scope.currentPath === '/actions') {
      $location.path('/scheduled-actions');
      $timeout(function() {
        $scope.currentPath = $location.path();
      });
    } else if ($scope.currentPath === '/scheduled-actions') {
      $location.path('/completed-actions');
      $timeout(function() {
        $scope.currentPath = $location.path();
      });
    } else {
      $location.path('/actions');
      $timeout(function() {
        $scope.currentPath = $location.path();
      });
    }
  };
  
  // Main state
  $scope.defaultActionState = function() {
    $timeout(function() {
      $scope.currentPath = '/actions';
    });
  };
  
  // Subheader tabs
  $scope.tab = 1;  
  $scope.changeTab = function(newTab){
    $scope.tab = newTab;
  };  
  $scope.isActiveTab = function(tab){
    return $scope.tab === tab;
  };
  // $scope.isOpen = false;
  // $scope.closeDropdown = function() {
  //   console.log(isOpen);
  //   $timeout(function() {
  //     $scope.isOpen = !$scope.isOpen;
  //   });
  // };

  // Add Action MODAL //
  $scope.addActionOpen = function (size, actionId) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/account/actions/my-action-create',
      controller: 'mvMyActionCreateCtrl',
      size: size,
      windowClass: 'action-update-modal'
    });
  };
  // Open Action Detail MODAL //
  $scope.actionDetailOpen = function (size, actionId) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/actions/action-details',
      controller: 'mvActionDetailCtrl',
      size: size,
      windowClass: 'action-modal-container',
      resolve: {
        action: function(){
          return actionId;
        }
      }
    });
  };
  
})
// Notification Badge Directive
.directive('notificationBadge', function($timeout) {
  return function(scope, elem, attrs) {
    $timeout(function() {
      elem.addClass('notification-badge');
    }, 0);
    scope.$watch(attrs.notificationBadge, function(newVal) {
      if(newVal > 0) {
        elem.attr('data-badge-count', newVal);
      } else {
        elem.removeAttr('data-badge-count');
      }
    });
  };
})
// Socket Factory
.factory('mySocket', function($rootScope) {
  var socket = io.connect();
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {  
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
