angular.module('app').controller('mvMyActionUpdateCtrl', function($scope, $timeout, $routeParams, $location, mvIdentity, mvNotifier, mvAuth, $modalInstance, action) {

  $scope.action = action;
  
  $scope.loaded = true;
  $scope.isCollapsed = true;
  
  $scope.myImage='';
  $scope.myCroppedImage='';
  $scope.myImageName = 'No File Choosen';

  var handleFileSelect = function(evt) {
    var file = evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function(evt) {
      $scope.$apply(function($scope) {
        $scope.myImage = evt.target.result;
      });
    };
    reader.readAsDataURL(file);
    $scope.myImageName = file.name;
    
  };
  $timeout(function() {
    angular.element(document.querySelector('#fileInput-action')).on('change',handleFileSelect);
  });

  // Update action
  $scope.updateAction = function(action_id) {
    var newActionData = {
      actionName: $scope.action.actionName,
      timeSpent: $scope.action.timeSpent,
      moneySpent: $scope.action.moneySpent,
      repeat: $scope.action.repeat,
      story: mvIdentity.currentUser.story,
      image: $scope.myCroppedImage,
      location: $scope.action.location,
      user: mvIdentity.currentUser._id
    };
    $scope.loaded = false;     
    // Update our service and notify promise
    mvAuth.updateAction(newActionData, action_id).then(function() {
      mvNotifier.notify('Action updated!');
      $scope.loaded = true;
      $modalInstance.close();
    }, function(reason) {
      mvNotifier.error(reason);
    });
  };
  
  $scope.closeModal = function(){
    $modalInstance.close();
  };
});
