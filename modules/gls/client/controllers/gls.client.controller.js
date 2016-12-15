(function () {
  'use strict';

  // Gls controller
  angular
    .module('gls')
    .controller('GlsController', GlsController);

  GlsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'glResolve'];

  function GlsController ($scope, $state, $window, Authentication, gl) {
    var vm = this;

    vm.authentication = Authentication;
    vm.gl = gl;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Gl
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.gl.$remove($state.go('gls.list'));
      }
    }

    // Save Gl
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.glForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.gl._id) {
        vm.gl.$update(successCallback, errorCallback);
      } else {
        vm.gl.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('gls.view', {
          glId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
