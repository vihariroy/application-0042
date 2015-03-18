angular.module('app').controller('mvActionPlayCtrl', function($scope, $timeout, $location, mvIdentity, mvCachedActions, mvNotifier, mvAuth, $modalInstance, action) {
  $scope.loaded = true;
  $scope.action_id = action._id;
  console.log(action)
  // Play action function, set action play data and notify if success or not
  $scope.playAction = function(dt, mytime, action_id) {
    // console.log(dt, mytime)
    var datetime = new Date('' + (dt.getMonth() + 1) + ',' + dt.getDate() + ',' + dt.getFullYear() + ' ' + mytime.getHours() + ':' + mytime.getMinutes() + ':' + mytime.getSeconds());
    // console.log(datetime);
    var repeatedNumber = action.repeatedNumber + 1

    var newActionPlayData = {
      scheduledId: action._id,
      actionName: action.actionName,
      image: action.image,
      isMessaged: [],
      location: action.location,
      messages: [],
      moneySpent: action.moneySpent,
      repeat: action.repeat,
      timeSpent: action.timeSpent,
      startedDatetime: datetime,
      completed: false,
      updatedAt: new Date(),
      user: mvIdentity.currentUser,
      creator: action.creator,
      repeatedNumber: 0,
      newRepeatedNumber: action.repeatedNumber
    };
    
    // var newActionData = {
    //   repeatedNumber: repeatedNumber
    // }
    // console.log(newActionData)
    $scope.loaded = false;
    mvAuth.playAction(newActionPlayData).then(function() {
      $scope.loaded = true;
      mvNotifier.notify('Action is scheduled...');
        $modalInstance.close();
    }, function(reason) {
      mvNotifier.error(reason);
    });
    // mvAuth.updateAction(newActionData, action_id).then(function() {
    //   // mvNotifier.notify('Action updated!');
    //   $modalInstance.close();
    // }, function(reason) {
    //   mvNotifier.error(reason);
    // });
  };

  $scope.closeModal = function() {
    $modalInstance.close();
  };
  
  //Datepicker
  $scope.openCalendar = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };
  $scope.today = new Date();
  $scope.format = 'mediumDate';
  
  // Timepicker
  $scope.mytime = new Date();
  $scope.hstep = 1;
  $scope.mstep = 15;
  
});
