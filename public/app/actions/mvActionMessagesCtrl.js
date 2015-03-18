angular.module('app').controller('mvActionMessagesCtrl', function($scope, $location, $timeout, mvMyMessagedActions, mvMyAction, $routeParams, ngDialog, mvAction, mvAuth, mvNotifier, $modal) {
  
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
  
});
