(function() {
  'use strict';

  angular
    .module('orders')
    .controller('CheckoutLoginController', CheckoutLoginController);

  CheckoutLoginController.$inject = ['$scope', 'ShopCartService'];

  function CheckoutLoginController($scope, ShopCartService) {
    var vm = this;
    vm.cart = ShopCartService.cart;
    vm.isMember = false;
    // Checkout login controller logic
    // ...

    init();

    function init() {
    }
  }
})();
