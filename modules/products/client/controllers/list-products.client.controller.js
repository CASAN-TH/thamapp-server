(function () {
  'use strict';

  angular
    .module('products')
    .controller('ProductsListController', ProductsListController);

  ProductsListController.$inject = ['ProductsService', 'Authentication'];

  function ProductsListController(ProductsService, Authentication, ShopCartService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.products = ProductsService.query();
  }
} ());
