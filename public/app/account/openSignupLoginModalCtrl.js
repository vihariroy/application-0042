angular.module('app').controller('openSignupLoginModalCtrl', function($scope, $http, mvNotifier, mvAuth, $location, $modal) {    
    
  // SIGNUP MODAL //
  $scope.signupOpen = function (size) {
  
    var modalInstance = $modal.open({
      templateUrl: '/partials/account/signup',
      controller: 'mvSignupCtrl',
      size: size,
      scope: $scope,
      windowClass: 'login-modal-container'
    });
    modalInstance.result.then(function(){
      console.log('modal is open');
    });
  };

  // LOGIN MODAL //
  $scope.loginOpen = function (size) {

    var modalInstance = $modal.open({
      templateUrl: '/partials/account/login',
      controller: 'mvNavBarLoginCtrl',
      size: size,
      scope: $scope,
      windowClass: 'login-modal-container'
    });
    modalInstance.result.then(function(){
      console.log('modal is open');
    });
  };
    
  // PROFILE MODAL //
  $scope.profileOpen = function (size) {

    var modalInstance = $modal.open({
      templateUrl: '/partials/account/profile',
      controller: 'mvProfileCtrl',
      size: size,
      scope: $scope,
      windowClass: 'user-edit-modal'
    });
    modalInstance.result.then(function(){
      console.log('modal is open');
    });
  };
      
  // Sign out //
  $scope.signout = function() {
    mvAuth.logoutUser().then(function() {
      $scope.$emit('logout', null);
      $scope.username = "";
      $scope.password = "";
      mvNotifier.notify('You have successfully signed out!');
      $location.path('/');
    });
  };
});
