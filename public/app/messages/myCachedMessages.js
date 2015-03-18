angular.module('app').factory('myCachedMessages', function(mvMyMessagedActions) {
  var messageList;
  // Return list of action
  return {
    query: function() {
      if(!messageList) {
        messageList = mvMyMessagedActions.query();
      }

      return messageList;
    }
  };
});