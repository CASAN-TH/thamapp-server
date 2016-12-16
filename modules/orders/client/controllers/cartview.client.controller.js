(function () {
  'use strict';

  angular
    .module('orders')
    .controller('CartviewController', CartviewController);

  CartviewController.$inject = ['$scope', 'ShopCartService'];

  function CartviewController($scope, ShopCartService) {
    var vm = this;
    vm.cart = ShopCartService.cart;

    // Cartview controller logic
    // ...

    init();

    function init() {
    }
  }
})();
