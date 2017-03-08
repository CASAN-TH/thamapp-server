(function () {
  'use strict';

  // Returnorders controller
  angular
    .module('returnorders')
    .controller('ReturnordersController', ReturnordersController);

  ReturnordersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'returnorderResolve'];

  function ReturnordersController ($scope, $state, $window, Authentication, returnorder) {
    var vm = this;

    vm.authentication = Authentication;
    vm.returnorder = returnorder;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Returnorder
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.returnorder.$remove($state.go('returnorders.list'));
      }
    }

    // Save Returnorder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.returnorderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.returnorder._id) {
        vm.returnorder.$update(successCallback, errorCallback);
      } else {
        vm.returnorder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('returnorders.view', {
          returnorderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
