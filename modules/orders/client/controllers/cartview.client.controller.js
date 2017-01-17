(function () {
  'use strict';

  angular
    .module('orders')
    .controller('CartviewController', CartviewController);

  CartviewController.$inject = ['$scope', 'Authentication', 'ShopCartService', 'PromotionsService'];

  function CartviewController($scope, Authentication, ShopCartService, PromotionsService) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.cart = {
      items: [{
        product: {}
      }]
    };
    vm.cart = ShopCartService.cart;
    vm.Promotion = Promotion;
    vm.check = {
      product: {}
    };
    vm.promotions = [];
    function Promotion() {
      PromotionsService.query(function (data) {
        angular.forEach(data, function (res) {
          vm.promotions.push(res);
          // res.expdate = new Date(res.expdate);
          // if (res.expdate.getFullYear() === new Date().getFullYear() && res.expdate.getMonth() === new Date().getMonth() && res.expdate.getDay() === new Date().getDay()) {
          //   for (var ii = 0; ii < vm.cart.items.length; ii++) {
          //     for (var iii = 0; iii < res.products.length; iii++) {
          //       if (res.products[iii].product._id === vm.cart.items[ii].product._id) {
          //         var sum = vm.cart.items[ii].qty / res.condition;
          //         if (res.discount.fixBath < 0) {
          //           if (sum >= 1) {
          //             $scope.discountBathTotal = sum * res.discount.fixBath;
          //           }
          //         } else if (res.discount.percen < 0) {
          //           if (sum >= 1) {
          //             $scope.discountPercenTotal = vm.cart.items[ii].amount * (res.discount.percen / 100);
          //           }
          //         } else if (res.freeitem.product !== undefined) {
          //           if (sum >= 1) {
          //             $scope.freeItem = res.freeitem.product.name;
          //             $scope.discountFreeItemTotal = sum * res.freeitem.qty;
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        });
      });
      // vm.promotions = vm.promotion.resolve();


    }


    // Cartview controller logic
    // ...


  }
})();
