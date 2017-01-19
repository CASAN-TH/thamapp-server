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
    vm.showstatuspost = showstatuspost;
    vm.acceptPost = acceptPost;
    vm.show = true;
    vm.showdetail = true;
    vm.showstatus = true;
    vm.delivers = [];
    vm.pending = pending;
    vm.paid = paid;
    vm.sent = sent;
    vm.complete = complete;
    vm.closeOrder = closeOrder;
    vm.confirmed = true;
    vm.readCustomer = readCustomer;
    vm.customers = [];
    vm.selectCustomer = selectCustomer;
    vm.addHis = addHis;
    vm.updateDeliver = updateDeliver;
    vm.acceptOrder = acceptOrder;
    vm.rejectOrder = rejectOrder;
    vm.addWait = addWait;

    function updateDeliver() {
      vm.order.deliverystatus = 'wait deliver';
      vm.addHis();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }


    function addHis() {
      vm.order.historystatus.push({
        status: vm.order.deliverystatus,
        datestatus: new Date()
      });
    }

    function addWait() {
      vm.order.historystatus.push({
        status: 'wait deliver',
        datestatus: new Date()
      });
    }


    function pending(isValid) {
      vm.order.deliverystatus = 'pending';
      vm.addHis();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function paid(isValid) {
      vm.order.deliverystatus = 'paid';
      vm.addHis();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function sent(isValid) {
      vm.order.deliverystatus = 'sent';
      vm.addHis();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function complete(isValid) {
      vm.order.deliverystatus = 'complete';
      vm.addHis();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function closeOrder(isValid) {
      vm.order.deliverystatus = 'close';
      vm.addHis();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function acceptOrder(isValid) {
      vm.order.deliverystatus = 'accept';
      vm.addHis();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function rejectOrder(isValid) {
      vm.order.deliverystatus = 'reject';
      vm.order.namedeliver = null;
      vm.addHis();
      vm.addWait();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function readProduct() {
      vm.products = ProductsService.query();
    }
    function readCustomer() {
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.customer = Users.query(function () {
          angular.forEach(vm.customer, function (usr) {
            if (usr.roles[0] === 'user')
              vm.customers.push(usr);
          });
          console.log(vm.customers);
        });
      }
    }
    function selectCustomer(cust) {
      vm.cust = cust;
      vm.order.shipping.firstname = vm.cust.firstName;
      vm.order.shipping.lastname = vm.cust.lastName;
      vm.order.shipping.tel = vm.cust.address.tel;
      vm.order.shipping.address = vm.cust.address.address;
      vm.order.shipping.subdistrict = vm.cust.address.subdistrict;
      vm.order.shipping.district = vm.cust.address.district;
      vm.order.shipping.province = vm.cust.address.province;
      vm.order.shipping.postcode = vm.cust.address.postcode;
      vm.order.shipping.email = vm.cust.email;
    }
    function readDeliver() {
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.deliver = Users.query(function () {
          angular.forEach(vm.deliver, function (user) {
            if (user.roles[0] === 'deliver')
              vm.delivers.push(user);
          });
        });
      }

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

    function acceptPost(itm) {
      vm.status = itm.deliverystatus;
      vm.status = 'accept';
      console.log(vm.status);
      vm.order.deliverystatus = vm.status;
    }

    function showstatuspost() {
      if (vm.order._id) {
        if (vm.order.delivery.deliveryid === '1' && vm.authentication.user.roles[0] === 'admin') {
          vm.showstatus = false;
        }
      }
    }

    function readDeliverid() {
      console.log(vm.authentication.user.roles[0]);
      if (vm.order._id) {
        if (vm.order.delivery.deliveryid === '1' && (vm.authentication.user.roles[0] === 'admin' || vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver')) {
          vm.show = false;
        } else if (vm.order.delivery.deliveryid === '0' && (vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver')) {
          vm.show = false;
        } else if (vm.order.deliverystatus === 'accept' && vm.authentication.user.roles[0] === 'admin') {
          vm.show = false;
          vm.showdetail = false;
        }
      } else if (!vm.order._id) {
        if (vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver') {
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
        vm.order.historystatus = [{
          status: 'confirmed',
          datestatus: new Date()
        }];
        vm.order.shipping = {
          firstname: '',
          lastname: '',
          address: '',
          postcode: '',
          subdistrict: '',
          province: '',
          district: '',
          tel: '',
          email: ''
        };
        vm.order.delivery = {
          deliveryid: '0'
        };
      } else {
        vm.order.docdate = new Date(vm.order.docdate);
      }
      readDeliverid();
      showstatuspost();

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
