angular.module('app').controller('mvMyActionCtrl', function($scope, $filter, $rootScope, $routeParams, $location, $timeout, mvIdentity, ngDialog, mySocket, mvAuth, mvNotifier, $modal) {
  
  // Sort options
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
          item.user.username.search(regex) !== -1 ||
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
    // console.log(action);
    return (!!mvIdentity.currentUser && action.user._id === mvIdentity.currentUser._id);
  };
  
  // PLAY (SCHEDULE) ACTION MODAL //
  $scope.scheduleCompleteActionModal = function(action) {
    if(action.completed === undefined || action.completed === true){
      var modalInstance = $modal.open({
        templateUrl: '/partials/actions/action-play',
        controller: 'mvActionPlayCtrl',
        windowClass: 'action-play-modal',
        resolve: {
          action: function(){
            return action;
          }
        }
      });
    }  
  };

});
