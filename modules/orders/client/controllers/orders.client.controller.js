(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'orderResolve', 'ShopCartService', 'ProductsService', 'Users'];

  function OrdersController($scope, $state, $window, Authentication, order, ShopCartService, ProductsService, Users) {
    var vm = this;
    vm.users = Users;
    vm.authentication = Authentication;
    vm.cart = ShopCartService.cart;
    vm.order = order;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.readProduct = readProduct;
    vm.calculate = calculate;
    vm.addItem = addItem;
    vm.init = init;
    vm.selectedProduct = selectedProduct;
    vm.selectedProductss = null;
    vm.removeItem = removeItem;
    vm.productChanged = productChanged;
    vm.readDeliver = readDeliver;
    vm.readDeliverid = readDeliverid;
    vm.show = true;
    vm.delivers = [];

    function readProduct() {
      vm.products = ProductsService.query();
    }
    function readDeliver() {

      vm.deliver = Users.query(function () {
        angular.forEach(vm.deliver, function (user) {
          if (user.roles[0] === 'deliver')
            vm.delivers.push(user);
        });
      });
    }
    function calculate(item) {


      item.qty = item.qty || 1;
      item.amount = item.product.price * item.qty;

      sumary();

    }
    function sumary() {
      vm.order.amount = 0;
      vm.order.items.forEach(function (itm) {
        vm.order.amount += itm.amount || 0;
      });
    }
    function addItem() {
      vm.order.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }
    function removeItem(item) {
      //vm.order.items.splice(item);
      vm.order.items.splice(vm.order.items.indexOf(item), 1);

      sumary();
    }
    function productChanged(item) {

      item.qty = item.qty || 1;
      item.amount = item.product.price * item.qty;

      sumary();
    }
    function readDeliverid() {
      console.log(vm.authentication.user.roles[0]);
      if (vm.order._id) {
        if (vm.order.delivery.deliveryid === '1' && (vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver')) {
          vm.show = false;
        }
      }
    }
    function init() {

      vm.readProduct();
      vm.readDeliver();
      if (!vm.order._id) {
        vm.order.docdate = new Date();
        vm.order.items = [{
          product: new ProductsService(),
          qty: 1
        }];
      } else {
        vm.order.docdate = new Date(vm.order.docdate);
      }
      readDeliverid();


    }

    function selectedProduct() {
      console.log(vm.selectedProductss);
      vm.order.items.push({
        product: new ProductsService(),
        qty: 1
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
