angular.module('app').factory('mvMyComment', function($resource) {
  var MyActionCommentResource = $resource('/api/my-actions/:id/comment', {_id: '@id'}, {
      'update': {method:'PUT',isArray:false},
      'delete': {method:'DELETE',isArray:false}
  });
  return MyActionCommentResource;
});