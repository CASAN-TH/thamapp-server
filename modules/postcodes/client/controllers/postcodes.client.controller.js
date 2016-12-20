(function () {
  'use strict';

  // Postcodes controller
  angular
    .module('postcodes')
    .controller('PostcodesController', PostcodesController);

  PostcodesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'postcodeResolve'];

  function PostcodesController ($scope, $state, $window, Authentication, postcode) {
    var vm = this;

    vm.authentication = Authentication;
    vm.postcode = postcode;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Postcode
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.postcode.$remove($state.go('postcodes.list'));
      }
    }

    // Save Postcode
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.postcodeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.postcode._id) {
        vm.postcode.$update(successCallback, errorCallback);
      } else {
        vm.postcode.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('postcodes.list', {
          postcodeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
