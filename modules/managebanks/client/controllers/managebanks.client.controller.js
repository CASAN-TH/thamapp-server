(function () {
  'use strict';

  // Managebanks controller
  angular
    .module('managebanks')
    .controller('ManagebanksController', ManagebanksController);

  ManagebanksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'managebankResolve'];

  function ManagebanksController ($scope, $state, $window, Authentication, managebank) {
    var vm = this;

    vm.authentication = Authentication;
    vm.managebank = managebank;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Managebank
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.managebank.$remove($state.go('managebanks.list'));
      }
    }

    // Save Managebank
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.managebankForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.managebank._id) {
        vm.managebank.$update(successCallback, errorCallback);
      } else {
        vm.managebank.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('managebanks.view', {
          managebankId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
