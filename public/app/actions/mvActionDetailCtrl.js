angular.module('app').controller('mvActionDetailCtrl', function($scope, $rootScope, ngDialog, mySocket, $timeout, $location, mvIdentity, mvMessage, mvCachedActions, mvAuth, $modal, mvNotifier, $modalInstance, action) {
  
  $scope.action = action;
  $scope.identity = mvIdentity;

  $scope.closeModal = function(){
    $modalInstance.close();
  };
  console.log($scope.action)
  
  $scope.loaded = false;
  
  // Edit Action MODAL //
  $scope.myActionUpdateOpen = function (actionId) {
    var modalInstance = $modal.open({
      templateUrl: '/partials/account/actions/my-action-update',
      controller: 'mvMyActionUpdateCtrl',
      windowClass: 'action-update-modal-container',
      resolve: {
        action: function(){
          return actionId;
        }
      }
    });
    $modalInstance.close();
  };

  // Delete one action and query actions again
  $scope.deleteAction = function() {
    var actionForDelete = action._id;
    $scope.loaded = false;
    mvAuth.deleteAction(actionForDelete).then(function() {
      $scope.loaded = true;
      mvNotifier.notify('Action is deleted!');
      $modalInstance.close();
    }, function(reason) {
      mvNotifier.error(reason);
    });
  };

  // PLAY (SCHEDULE) ACTION MODAL //
  $scope.scheduleCompleteActionModal = function(actionId) {
    if(action.completed === undefined || action.completed === true){
      var modalInstance = $modal.open({
        templateUrl: '/partials/actions/action-play',
        controller: 'mvActionPlayCtrl',
        windowClass: 'action-play-modal',
        resolve: {
          action: function(){
            return actionId;
          }
        }
      });
      $modalInstance.close();
    } else if (action.completed === false) {      
      Date.prototype.addDays = function(days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
      };
      var dat = new Date();
      var newActionDataRepeat = action;
      newActionDataRepeat.startedDatetime = dat.addDays(action.repeat);
      var newActionData = {
        _id: action._id,
        repeat: action.repeat,
        completed: true,
      };
      // console.log(newActionDataRepeat.startedDatetime)
      mvAuth.updateCompletedAction(newActionData).then(function() {
        mvNotifier.notify('Action is completed!');
        $timeout(function() {
          $location.path('/completed-actions');
        });
        $modalInstance.close();
      }, function(reason) {
        mvNotifier.error(reason);
      });
      mvAuth.createRepeatedAction(newActionDataRepeat).then(function() {
        mvNotifier.notify('New action created!');
        $modalInstance.close();
      }, function(reason) {
        mvNotifier.error(reason);
      });
    }    
  };
  // Create message
  $scope.createMessage = function(action, comment) {
    var newMessageData = {
      comment: comment,
      startedDatetime: new Date(),
      action: action._id
    };
    // Send createAction data into service and notify the promise
    mvAuth.createMessage(newMessageData, action.user._id).then(function() {
      mvNotifier.notify('Message created!');
    }, function(reason) {
      mvNotifier.error(reason);
    });
  };

});
