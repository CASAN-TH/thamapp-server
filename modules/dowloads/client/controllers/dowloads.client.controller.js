(function () {
  'use strict';

  // Dowloads controller
  angular
    .module('dowloads')
    .controller('DowloadsController', DowloadsController);

  DowloadsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'dowloadResolve'];

  function DowloadsController ($scope, $state, $window, Authentication, dowload) {
    var vm = this;

    vm.authentication = Authentication;
    vm.dowload = dowload;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Dowload
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.dowload.$remove($state.go('dowloads.list'));
      }
    }

    // Save Dowload
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.dowloadForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.dowload._id) {
        vm.dowload.$update(successCallback, errorCallback);
      } else {
        vm.dowload.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('dowloads.view', {
          dowloadId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
