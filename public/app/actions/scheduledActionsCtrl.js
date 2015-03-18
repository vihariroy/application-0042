angular.module('app').controller('scheduledActionsCtrl', function($scope, $location, mvIdentity, ngDialog, mvAction, mvAuth, mvNotifier, $modal, mvCachedActions, $timeout, $upload) {
  
  
  $scope.sortOptions = [
    {value: "actionName",text: "Action Name"},
    {value: "-startedDatetime",text: "Started Datetime"},
    {value: "byUsername",text: "By Username"},
    {value: "timeSpent",text: "Time Spent"},
    {value: "-moneySpent",text: "Money Spent"},
    {value: "-repeat",text: "Repeat"}
  ];
  $scope.sortOrder = $scope.sortOptions[1].value;
  
  
  // Filter
  // Creating default date format, search the regex from action properties and return them
  var match = function (item, val) {
    var regex = new RegExp(val, 'i');
    var startedDatetime = item.startedDatetime;
      startedDatetime = new Date(startedDatetime);
    var fullname = item.user.firstName + ' ' + item.user.lastName;
    return item.actionName.search(regex) !== -1 ||
          startedDatetime.toDateString().search(regex) !== -1 ||
          startedDatetime.toTimeString().search(regex) !== -1 ||
          fullname.search(regex) !== -1 ||
          item.username.search(regex) !== -1 ||
          item.location.search(regex) !== -1 ||
          item.timeSpent.toString().search(regex) !== -1 ||
          item.moneySpent.toString().search(regex) !== -1 ||
          item.repeat.toString().search(regex) !== -1;
  };
  // Default return true, return matched action if filter input is equal with action property
  $scope.searchText = function(action) {
    if (!$scope.q) return true;
    var matched = true;    
    $scope.q.split(' ').forEach(function(token) {
        matched = matched && match(action, token);
    });    
    return matched;
  };
  $scope.filterActions = function(action) {
    return (!!mvIdentity.currentUser && action.completed === false && (action.user._id === mvIdentity.currentUser._id || action.creator === mvIdentity.currentUser._id));
  };

  // PLAY (SCHEDULE) ACTION MODAL //
  $scope.scheduleCompleteActionModal = function(action) {
    console.log(action)
    if (action.completed === false) {        
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
        creator: action.creator
      };
      $scope.loaded = false;
      mvAuth.updateCompletedAction(newActionData).then(function() {
        mvNotifier.notify('Action is completed!');
        $scope.loaded = true;
      }, function(reason) {
        mvNotifier.error(reason);
      });
      mvAuth.createRepeatedAction(newActionDataRepeat).then(function() {
        mvNotifier.notify('New action created!');
      }, function(reason) {
        mvNotifier.error(reason);
      });
    }
  };
  
});
