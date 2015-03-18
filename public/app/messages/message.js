angular.module('app').factory('mvMessage', function($resource) {
  var MessageResource = $resource('/api/messages/:id');
  return MessageResource;
});