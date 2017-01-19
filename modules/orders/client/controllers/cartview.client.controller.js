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
    vm.loopCheck = loopCheck;
    vm.checkPromotion = checkPromotion;
    function Promotion() {
      PromotionsService.query(function (data) {
        angular.forEach(data, function (res) {
          vm.promotions.push(res);
        });
      });
      // vm.promotions = vm.promotion.resolve();


    }
    function checkPromotion(_id, qty) {
      $http.get('api/promotions/productid/' + _id + '/' + qty).success(function (response) {
        vm.result = response;
      }).error(function (err) {
        console.log(err);
      });
    }

    function loopCheck() {
      for (var i = 0; i > vm.cart.items.length; i++) {
        vm.checkPromotion(vm.cart.items[i].product._id, vm.cart.items[i].qty);
      }
    }



    // Cartview controller logic
    // ...


  }
})();
