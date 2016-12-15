(function() {
  'use strict';

  angular
    .module('products')
    .controller('StoreController', StoreController);

  StoreController.$inject = ['ProductsService'];

  function StoreController(ProductsService) {
    var vm = this;

    vm.products = ProductsService.query();
  }
})();
