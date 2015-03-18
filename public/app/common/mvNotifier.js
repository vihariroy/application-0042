angular.module('app').value('mvToastr', toastr);
// Plugin for notifying is success or not
angular.module('app').factory('mvNotifier', function(mvToastr) {
  return {
    notify: function(msg) {
      mvToastr.success(msg);
      console.log(msg);
    },
    error: function(msg) {
      mvToastr.error(msg);
      console.log(msg);
    }
  };
});