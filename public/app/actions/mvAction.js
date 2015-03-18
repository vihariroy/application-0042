angular.module('app').factory('mvAction', function($resource) {
  var ActionResource = $resource('/api/actions/:id', {_id: '@id'}, {
      'update': {method:'PUT',isArray:false},
      'delete': {method:'DELETE',isArray:false}
  });
  return ActionResource;
});