(function() {
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
    // Checkout login controller logic
    // ...

    init();

    function init() {
    }
  }
})();
