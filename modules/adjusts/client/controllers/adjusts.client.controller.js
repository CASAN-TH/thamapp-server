(function () {
  'use strict';

  // Adjusts controller
  angular
    .module('adjusts')
    .controller('AdjustsController', AdjustsController);

  AdjustsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'adjustResolve'];

  function AdjustsController ($scope, $state, $window, Authentication, adjust) {
    var vm = this;

    vm.authentication = Authentication;
    vm.adjust = adjust;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Adjust
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.adjust.$remove($state.go('adjusts.list'));
      }
    }

    // Save Adjust
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.adjustForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.adjust._id) {
        vm.adjust.$update(successCallback, errorCallback);
      } else {
        vm.adjust.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('adjusts.view', {
          adjustId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
