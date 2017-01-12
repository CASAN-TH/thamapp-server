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
    vm.remove = remove;
    vm.save = save;
    vm.readProduct = readProduct;
    vm.productChanged = productChanged;

    function productChanged(selectedProduct) {
      vm.promotion.products = [{
        product: selectedProduct
      }];
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
      if(!vm.promotion._id){
        vm.promotion.products = [{
          product: {}
        }];
      }else{
        vm.selectedProduct = vm.promotion.products[0].product;
      }
      vm.products = ProductsService.query();
    }
  }
} ());
