angular.module('app').factory('mvMyMessagedActions', function($resource) {
  var MessagedActionsResource = $resource('/api/my-messaged-actions');
  return MessagedActionsResource;
});