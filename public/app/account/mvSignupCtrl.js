angular.module('app').controller('mvSignupCtrl', function($scope, mvUser, mvIdentity, mvNotifier, $modal, $location, mvAuth, $modalInstance) {
  // sign up, set user data, return promise and if success relocate to home url
  $scope.signup = function() {
    var newUserData = {
      username: $scope.username,
      email: $scope.email,
      password: $scope.password
    };
    
    mvAuth.createUser(newUserData).then(function() {
      mvNotifier.notify('User account created!');
      $scope.$emit('signupUser', mvIdentity.currentUser);
      $location.path('/');
      $modalInstance.close();
    }, function(reason) {
      mvNotifier.error(reason);
    });
  };
  
  $scope.cancel = function(){
    $modalInstance.dismiss('cancel');
  };

  $scope.closeModal = function() {
    $modalInstance.close();
  };
  
});
