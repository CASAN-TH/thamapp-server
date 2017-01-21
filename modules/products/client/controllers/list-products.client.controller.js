(function () {
  'use strict';

  angular
    .module('products')
    .controller('ProductsListController', ProductsListController);

  ProductsListController.$inject = ['ProductsService', 'Authentication', 'PromotionsService'];

  function ProductsListController(ProductsService, Authentication, PromotionsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.readProduct = readProduct;
    vm.readPromotion = readPromotion;
    vm.promotion = [];
    vm.products = [];
    function readProduct() {
      ProductsService.query(function (products) {
        angular.forEach(products, function (pro) {
          vm.products.push(pro);
          pro.promotion = [];
          angular.forEach(vm.promotion, function (res) {
            if (res.product._id === pro._id) {
              pro.promotion.push(res);
            }
          });
        });
      });
    }
    function readPromotion() {
      PromotionsService.query(function (promotion) {
        angular.forEach(promotion, function (res) {
          vm.promotion.push(res);
        });
      });
    }
  }
} ());
