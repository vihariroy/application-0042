angular.module('app').factory('mvCachedActions', function(mvAction) {
  var actionList;
  
  // Return list of action
  return {
    query: function() {
      if(!actionList) {
        
        actionList = mvAction.query();
      }
      return actionList;
    }
  };
});