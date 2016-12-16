(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'orderResolve', 'ShopCartService'];

  function OrdersController($scope, $state, $window, Authentication, order, ShopCartService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.cart = ShopCartService.cart;
    vm.order = order;
    vm.order.items = vm.cart.load();
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addQty = addQty;
    vm.delQty = delQty;
    vm.sumTotal = sumTotal;

    function sumTotal() {
      vm.order.amount = 0;
      vm.order.items.forEach(function (item) {
        vm.order.amount += item.amount;
      });
    }

    function addQty(product) {
      vm.order.items.forEach(function (item) {
        if (item.product._id === product.product._id) {
          item.qty += 1;
          item.amount = item.product.price * item.qty;
        }
      });
    }

    function delQty(product) {
      vm.order.items.forEach(function (item) {
        if (item.product._id === product.product._id) {
          item.qty -= 1;
          item.amount = item.product.price * item.qty;
        }
      });
    }

    // Remove existing Order
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.order.$remove($state.go('orders.list'));
      }
    }

    // Save Order
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.orderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.order._id) {
        vm.order.$update(successCallback, errorCallback);
      } else {
        vm.order.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('orders.view', {
          orderId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
