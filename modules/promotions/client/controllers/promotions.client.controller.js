(function () {
  'use strict';

  // Promotions controller
  angular
    .module('promotions')
    .controller('PromotionsController', PromotionsController);

  PromotionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'promotionResolve'];

  function PromotionsController ($scope, $state, $window, Authentication, promotion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.promotion = promotion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Promotion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.promotion.$remove($state.go('promotions.list'));
      }
    }

    // Save Promotion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.promotionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.promotion._id) {
        vm.promotion.$update(successCallback, errorCallback);
      } else {
        vm.promotion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('promotions.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
