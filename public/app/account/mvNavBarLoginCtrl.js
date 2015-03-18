angular.module('app').controller('mvNavBarLoginCtrl', function(mySocket, $scope, $rootScope, $http, $modal, mvIdentity, mvNotifier, mvAuth, $location, $modalInstance) {
  
  $scope.identity = mvIdentity;
  
  $scope.closeModal = function() {
    $modalInstance.close();
  };
  // Sign in, authenticate username and password
  $scope.signin = function(username, password) {
    mvAuth.authenticateUser(username, password).then(function(success) {
      if(success) {
        $scope.$emit('loginUser', mvIdentity.currentUser);
        mvNotifier.notify('You have successfully signed in!');
        $location.path('/my-actions');
        $modalInstance.close();
      } else {
        mvNotifier.notify('Username/Password combination incorrect');
      }
    });
  };
  
});
