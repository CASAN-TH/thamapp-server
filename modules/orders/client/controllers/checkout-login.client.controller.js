(function () {
  'use strict';

  angular
    .module('orders')
    .controller('CheckoutLoginController', CheckoutLoginController);

  CheckoutLoginController.$inject = ['$scope', 'Authentication', 'ShopCartService'];

  function CheckoutLoginController($scope, Authentication, ShopCartService) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.cart = ShopCartService.cart;
    vm.isMember = false;
    vm.step = $scope.authentication.user ? 2 : 1;
    vm.checkStep = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }
      vm.step += 1;
    };
    // Checkout login controller logic
    // ...

    init();

    function init() {
    }
  }
})();
