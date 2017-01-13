(function () {
  'use strict';

  // Promotions controller
  angular
    .module('promotions')
    .controller('PromotionsController', PromotionsController);

  PromotionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'promotionResolve', 'ProductsService'];

  function PromotionsController($scope, $state, $window, Authentication, promotion, ProductsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.promotion = promotion;
    vm.error = null;
    vm.form = {};
    vm.selectedProduct = {};
    vm.selectedFreeProduct = {};
    vm.remove = remove;
    vm.save = save;
    vm.readProduct = readProduct;
    vm.productChanged = productChanged;
    vm.freeProductChanged = freeProductChanged;
    $scope.state = '0';
    vm.sumbath = sumbath;
    if (!vm.promotion.freeitem) {
      vm.promotion.freeitem = {
        product: {}
      };
    } else {
      $scope.state = '2';
    }
    if(vm.promotion.expdate){
      vm.promotion.expdate = new Date(vm.promotion.expdate);
    }
    function sumbath(qty) {
      if (qty >= 1) {
        vm.promotion.freeitem.amount = qty * vm.promotion.freeitem.price;
      }
    }
    function productChanged(selectedProduct) {
      vm.promotion.products = [{
        product: selectedProduct
      }];
    }

    function freeProductChanged(selectedFreeProduct) {
      vm.promotion.freeitem.price = selectedFreeProduct.price;
      if (!vm.promotion.freeitem.amount) {
        vm.promotion.freeitem.qty = 1;
        vm.promotion.freeitem.amount = vm.promotion.freeitem.qty * vm.promotion.freeitem.price;
      }
      vm.promotion.freeitem.product = selectedFreeProduct;
    }

    // Remove existing Promotion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.promotion.$remove($state.go('promotions.list'));
      }
    }

    // Save Promotion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.promotionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.promotion._id) {
        vm.promotion.$update(successCallback, errorCallback);
      } else {
        vm.promotion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('promotions.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function readProduct() {
      if (!vm.promotion._id) {
        vm.promotion.products = [{
          product: {}
        }];
      } else {
        vm.selectedProduct = vm.promotion.products[0].product;
      }
      if (!vm.promotion.freeitem) {
        vm.promotion.freeitem = {
          product: {}
        };
      } else {
        vm.selectedFreeProduct = vm.promotion.freeitem.product;
      }
      if (vm.promotion.discount) {
        if (vm.promotion.discount.percen) {
          $scope.state = '1';
        }
      }
      vm.products = ProductsService.query();
    }
  }
} ());
