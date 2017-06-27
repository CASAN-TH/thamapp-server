(function () {
  'use strict';

  // Freerices controller
  angular
    .module('freerices')
    .controller('FreericesController', FreericesController);

  FreericesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'freericeResolve'];

  function FreericesController($scope, $state, $window, Authentication, freerice) {
    var vm = this;

    vm.authentication = Authentication;
    vm.freerice = freerice;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Freerice

    vm.execute = function () {
      alert('execute');
    };

    vm.clears = function () {
      alert('clear');
    };


    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.freerice.$remove($state.go('freerices.list'));
      }
    }

    // Save Freerice
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.freericeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.freerice._id) {
        vm.freerice.$update(successCallback, errorCallback);
      } else {
        vm.freerice.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('freerices.view', {
          freericeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
