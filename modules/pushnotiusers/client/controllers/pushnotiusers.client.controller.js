(function () {
  'use strict';

  // Pushnotiusers controller
  angular
    .module('pushnotiusers')
    .controller('PushnotiusersController', PushnotiusersController);

  PushnotiusersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'pushnotiuserResolve'];

  function PushnotiusersController ($scope, $state, $window, Authentication, pushnotiuser) {
    var vm = this;

    vm.authentication = Authentication;
    vm.pushnotiuser = pushnotiuser;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Pushnotiuser
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.pushnotiuser.$remove($state.go('pushnotiusers.list'));
      }
    }

    // Save Pushnotiuser
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.pushnotiuserForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.pushnotiuser._id) {
        vm.pushnotiuser.$update(successCallback, errorCallback);
      } else {
        vm.pushnotiuser.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('pushnotiusers.view', {
          pushnotiuserId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
