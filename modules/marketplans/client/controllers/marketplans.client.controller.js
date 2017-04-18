(function () {
  'use strict';

  // Marketplans controller
  angular
    .module('marketplans')
    .controller('MarketplansController', MarketplansController);

  MarketplansController.$inject = ['$scope', '$state', '$window', 'Authentication', 'marketplanResolve'];

  function MarketplansController ($scope, $state, $window, Authentication, marketplan) {
    var vm = this;

    vm.authentication = Authentication;
    vm.marketplan = marketplan;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;



 if (vm.marketplan.startdate) {
       vm.marketplan.startdate = new Date( vm.marketplan.startdate);
    }
    if (vm.marketplan.enddate) {
       vm.marketplan.enddate = new Date( vm.marketplan.enddate);
    }
    // Remove existing Marketplan
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.marketplan.$remove($state.go('marketplans.list'));
      }
    }

    // Save Marketplan
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.marketplanForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.marketplan._id) {
        vm.marketplan.$update(successCallback, errorCallback);
      } else {
        vm.marketplan.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('marketplans.list', {
          marketplanId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
