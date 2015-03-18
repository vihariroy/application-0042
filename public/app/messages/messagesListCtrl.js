angular.module('app').controller('messagesListCtrl', function($scope, mySocket, mvIdentity, ngDialog, mvAction, mvAuth, mvNotifier, $modal) {
  
  // Create actions when we press + button
  $scope.createMessage = function(action, comment) {
    var newMessageData = {
      comment: comment,
      startedDatetime: new Date(),
      action: action._id
    };
    
    // Send createAction data into service and notify the promise
    mvAuth.createMessage(newMessageData).then(function() {
      mvNotifier.notify('Message created!');
    }, function(reason) {
      mvNotifier.error(reason);
    });
  };
  
  $scope.isCollapsed = true;
  $scope.toggleCollapse = function(){
    $scope.isCollapsed = true;
  };

  $scope.filterActions = function(action) {
    if(action.user._id === mvIdentity.currentUser._id) {
      return true;
    }
    var myMessagedAction = false;
    angular.forEach(action.isMessaged, function(isMsgd) {
      if(isMsgd === mvIdentity.currentUser._id) {
        myMessagedAction = true;
      }
    });
    return myMessagedAction;
  };
  
  $scope.actionOrder = '-updatedAt';
  $scope.messageOrder = '-startedDatetime';
  
});
