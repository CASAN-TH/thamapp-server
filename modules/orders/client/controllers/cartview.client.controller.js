(function () {
  'use strict';

  angular
    .module('orders')
    .controller('CartviewController', CartviewController);

  CartviewController.$inject = ['$scope', 'Authentication', 'ShopCartService', 'PromotionsService', '$http'];

  function CartviewController($scope, Authentication, ShopCartService, PromotionsService, $http) {
    var vm = this;
    $scope.authentication = Authentication;
    vm.cart = {
      items: [{
        product: {}
      }]
    };
    vm.cart = ShopCartService.cart;
    vm.Promotion = Promotion;
    vm.promotions = [];
    vm.checkPromotion = checkPromotion;
    vm.initPromotion = initPromotion;
    function Promotion() {
      PromotionsService.query(function (data) {
        angular.forEach(data, function (res) {
          vm.promotions.push(res);
        });
      });
      // vm.promotions = vm.promotion.resolve();
    }

    function initPromotion() {
      var product = {};
      var qty = 0;
      vm.cart.items.forEach(function (item) {
        for (var i = 0; i < vm.promotions.length; i++) {
          if (vm.promotions[i].product._id.toString() === item.product._id.toString()) {
            product = item.product;
            qty = item.qty;
            vm.checkPromotion(product, qty);
          }
        }
      });
    }



    function checkPromotion(product, qty) {
      $http.get('api/promotions/productid/' + product._id + '/' + qty).success(function (response) {
        vm.result = response;
      }).error(function (err) {
        console.log(err);
      });
    }



    // Cartview controller logic
    // ...


  }
})();
