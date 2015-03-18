angular.module('app', ['ngResource', 'ngRoute', 'ngAnimate', 'angular.filter', 'ngDialog', 'angular-loading-bar', 'ui.bootstrap.tpls', 'ui.bootstrap.typeahead', 'ui.bootstrap.datepicker', 'ui.bootstrap.timepicker', 'ui.bootstrap.modal', 'ui.bootstrap.accordion', 'ngImgCrop', 'angularFileUpload']);
// Check user auth for route
angular.module('app').config(function($routeProvider, $locationProvider, cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.includeBar = true;
  
  var routeRoleChecks = {
    admin: {auth: function(mvAuth) {
      return mvAuth.authorizeCurrentUserForRoute('admin');
    }},
    user: {auth: function(mvAuth) {
      return mvAuth.authorizeAuthenticatedUserForRoute();
    }}
  };
  
  // For no hash, simple url
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $routeProvider
    // .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl'})
    .when('/admin/users', { templateUrl: '/partials/admin/user-list',
      controller: 'mvUserListCtrl', resolve: routeRoleChecks.admin
    })
    .when('/signup', { templateUrl: '/partials/account/signup',
      controller: 'mvSignupCtrl'
    })
    .when('/profile', { templateUrl: '/partials/account/profile',
      controller: 'mvProfileCtrl', resolve: routeRoleChecks.user
    })
    .when('/actions', { templateUrl: '/partials/actions/action-list',
      controller: 'mvActionListCtrl'
    })
    .when('/scheduled-actions', { templateUrl: '/partials/actions/scheduled-actions',
      controller: 'scheduledActionsCtrl', resolve: routeRoleChecks.user
    })
    .when('/completed-actions', { templateUrl: '/partials/actions/completed-actions',
      controller: 'completedActionsCtrl', resolve: routeRoleChecks.user
    })
    .when('/messages', { templateUrl: '/partials/messages/messages-list',
      controller: 'messagesListCtrl', resolve: routeRoleChecks.user
    })
    .when('/create-action', { templateUrl: '/partials/account/actions/my-action-create',
      controller: 'mvMyActionCreateCtrl', resolve: routeRoleChecks.user
    })
    .when('/my-actions', { templateUrl: '/partials/account/actions/my-action',
      controller: 'mvMyActionCtrl', resolve: routeRoleChecks.user
    })
    .when('/my-actions/:id/update', { controller: 'mvMyActionUpdateCtrl', resolve: routeRoleChecks.user
    })
    .when('/actions/:id/play', { templateUrl: '/partials/actions/action-play',
      controller: 'mvActionPlayCtrl', resolve: routeRoleChecks.user
    })
     .when('/story', { templateUrl: '/partials/account/actions/my-action-story',
      controller: 'myActionStoryCtrl', resolve: routeRoleChecks.user
    })
    
    .otherwise({ redirectTo: '/actions' });
});

angular.module('app').run(function($rootScope, $location, $timeout, cfpLoadingBar) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  });
});
