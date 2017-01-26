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
    //vm.readPromotion = readPromotion;
    //vm.promotion = [];
    vm.products = [];
    function readProduct() {
      ProductsService.query(function (products) {
        PromotionsService.query(function (promotions) {
          angular.forEach(products, function (product) {
            product.promotions = [];
            angular.forEach(promotions, function (promotion) {
              if (promotion.product._id === product._id) {
                product.promotions.push(promotion);
              }
            });
            vm.products.push(product);
          });
        });

      });
    }
    
  }
} ());
