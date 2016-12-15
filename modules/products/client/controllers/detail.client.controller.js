(function () {
  'use strict';

  angular
    .module('products')
    .controller('DetailController', DetailController);

  DetailController.$inject = ['productResolve', 'ShopCartService'];

  function DetailController(productResolve, ShopCartService) {
    var vm = this;

    vm.product = productResolve;
    vm.cart = ShopCartService.cart;
    vm.checkOut = function(product){
      vm.cart.add(product);
    };
  }
})();
