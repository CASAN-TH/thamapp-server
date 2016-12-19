(function () {
  'use strict';

  angular
    .module('orders')
    .controller('CartviewController', CartviewController);

  CartviewController.$inject = ['$scope', 'Authentication', 'ShopCartService'];

  function CartviewController($scope, Authentication, ShopCartService) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.cart = ShopCartService.cart;

    // Cartview controller logic
    // ...

    
  }
})();
