angular.module('app').factory('cachedMessages', function(mvMessage) {
  var messageList;
  // Return list of action
  return {
    query: function() {
      if(!messageList) {
        messageList = mvMessage.query();
      }

      return messageList;
    }
  };
});