angular.module('app').factory('mvMyMessage', function($resource) {
  var MyMessageResource = $resource('/api/my-messages/:id', {_id: '@id'}, {
      'update': {method:'PUT',isArray:false},
      'delete': {method:'DELETE',isArray:false}
  });
  return MyMessageResource;
});