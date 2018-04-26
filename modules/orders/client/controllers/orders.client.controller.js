(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = ['$scope', '$state', '$http', '$window', 'Authentication', 'orderResolve', 'ShopCartService', 'ProductsService', 'Users'];

  function OrdersController($scope, $state, $http, $window, Authentication, order, ShopCartService, ProductsService, Users) {
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
    vm.selectDeliver = selectDeliver;
    vm.addHis = addHis;
    vm.updateDeliver = updateDeliver;
    vm.acceptOrder = acceptOrder;
    vm.rejectOrder = rejectOrder;
    vm.addWait = addWait;
    vm.changeDis = changeDis;
    vm.updateWaitStatus = updateWaitStatus;
    vm.selectProduct = selectProduct;
    vm.addQty = addQty;
    vm.removeQty = removeQty;
    vm.cancelOrder = cancelOrder;
    vm.updatedata = updatedata;

    vm.setLimit = function () {
      $scope.topsearch = '';
      $scope.filterText = '';
    };

    $scope.filter = function (topsearch) {
      if (topsearch.length > 4) {
        $scope.filterText = topsearch;
      } else {
        $scope.filterText = '';
      }
    };

    $scope.printDiv = function (divName) {
      // var printContents = document.getElementById(divName).innerHTML;
      // var popupWin = window.open('', '_blank', 'width=300,height=300');
      // popupWin.document.open();
      // popupWin.document.write('<html><head><link rel="stylesheet"  href="lib/bootstrap/dist/css/bootstrap.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
      // popupWin.document.close();

      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
      popupWin.window.focus();
      popupWin.document.open();
      popupWin.document.write('<!DOCTYPE html><html><head><title>TITLE OF THE PRINT OUT</title><link rel="stylesheet" type="text/css" href="https://thamapp.herokuapp.com/lib/bootstrap/dist/css/bootstrap.css" /><link rel="stylesheet" href="https://thamapp.herokuapp.com/dist/application.min.css"/></head><body><div>' + printContents + '</div></html>');
      popupWin.document.close();
    };

    if (vm.order.items) {
      vm.order.items = vm.order.items;
    } else {
      vm.order.items = [];
    }


    function addQty(item) {
      item.qty += 1;
      calculate(item);

    }

    function removeQty(item) {
      item.qty -= 1;
      calculate(item);
    }
    function selectProduct(item) {
      vm.order.items.push({
        product: item,
        qty: 1
      });
      sumary(vm.order.items);
    }

    function changeDis() {
      if (vm.order.discount) {
        vm.order.amount = vm.order.amount - vm.order.discount;
      }
    }

    function updateDeliver() {
      if (vm.order.deliverystatus === 'accept') {
        if (vm.namedeliID === vm.order.namedeliver._id) {
          vm.updatedata();
        } else if (vm.namedeliID !== vm.order.namedeliver._id) {
          vm.order.deliverystatus = 'wait deliver';
          vm.addHis();
          vm.updatedata();
        }
      } else if (vm.order.deliverystatus === 'reject') {
        vm.order.deliverystatus = 'wait deliver';
        vm.addHis();
        vm.updatedata();
      }
    }

    function updatedata() {
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
      $state.go('orders.list');
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

    function updateWaitStatus(isValid) {
      if (vm.order._id) {
        if (vm.order.namedeliver && (vm.order.deliverystatus === 'confirmed')) {
          if (vm.order.deliverystatus === 'wait deliver') {

          } else {
            vm.order.deliverystatus = 'wait deliver';
            vm.addHis();
          }
        }
      } else if (!vm.order._id) {
        if (vm.order.namedeliver) {
          if (vm.order.deliverystatus === 'wait deliver') {

          } else {
            vm.order.deliverystatus = 'wait deliver';
            vm.addHis();
          }
        }
      }


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

    function cancelOrder() {
      vm.order.deliverystatus = 'cancel';
      vm.addHis();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function acceptOrder(isValid) {

      if (vm.order.namedeliver) {
        vm.order.deliverystatus = 'accept';
      } else {
        vm.order.namedeliver = vm.authentication.user;
        vm.order.deliverystatus = 'accept';
      }

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
      // vm.addWait();
      vm.order.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function readProduct() {
      vm.products = ProductsService.query();
      // console.log(vm.products);
    }
    function readCustomer() {
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.customer = Users.query(function () {
          angular.forEach(vm.customer, function (usr) {
            if (usr.roles[0] === 'user')
              vm.customers.push(usr);
          });
          // console.log(vm.customers);
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

    function selectDeliver(deli) {
      vm.deliver = deli;
      vm.order.namedeliver = vm.deliver;
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

      sumary(vm.order.items);
    }
    function sumary(items) {
      vm.order.totalamount = 0;
      angular.forEach(items, function (prod) {
        prod.amount = prod.product.price * prod.qty;
        prod.retailerprice = prod.product.retailerprice;
        //vm.order.amount = prod.amount;
        vm.order.totalamount += prod.amount;
      });
      vm.order.amount = vm.order.totalamount + vm.order.discountpromotion;
    }
    function addItem() {
      vm.order.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }
    function removeItem(item) {
      //vm.order.items.splice(item);
      vm.order.items.splice(item, 1);

      sumary(vm.order.items);
    }

    function productChanged(item) {

      item.qty = item.qty || 1;
      item.amount = item.product.price * item.qty;

      sumary();
    }

    function acceptPost(itm) {
      vm.status = itm.deliverystatus;
      vm.status = 'accept';
      // console.log(vm.status);
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
      // console.log(vm.authentication.user.roles[0]);
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
      if (!vm.order._id && vm.authentication.user.roles[0] === 'deliver') {
        vm.order.docdate = new Date();
        vm.order.docno = (+ new Date());
        // vm.order.items = [{
        //   product: new ProductsService(),
        //   qty: 1
        // }];
        vm.order.historystatus = [{
          status: 'complete',
          datestatus: new Date()
        }];

        vm.order.shipping = {
          firstname: vm.authentication.user.firstName,
          lastname: vm.authentication.user.lastName,
          address: vm.authentication.user.address.address,
          postcode: vm.authentication.user.address.postcode,
          subdistrict: vm.authentication.user.address.subdistrict,
          province: vm.authentication.user.address.province,
          district: vm.authentication.user.address.district,
          tel: vm.authentication.user.address.tel,
          email: vm.authentication.user.email
        };
        vm.order.delivery = {
          deliveryid: '0'
        };
        vm.order.deliverystatus = 'complete';
        vm.order.namedeliver = vm.authentication.user;
        vm.order.user = vm.authentication.user;
        vm.order.discountpromotion = 0;
        vm.order.totalamount = 0;
        if (vm.order.amount) {
          vm.order.amount = vm.order.amount;
        } else {
          vm.order.amount = 0;
        }

      }
      else if (!vm.order._id) {
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
        // console.log( vm.order.namedeliver);
        if (vm.order.namedeliver) {
          vm.namedeliID = vm.order.namedeliver._id;
        }

        vm.order.docdate = new Date(vm.order.docdate);
      }
      readDeliverid();
      showstatuspost();

    }

    function selectedProduct() {
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
        vm.changeDis();
        vm.updateWaitStatus();
        vm.order.$update(successCallback, errorCallback);
      } else {
        vm.changeDis();
        if (vm.authentication.user.roles[0] !== 'deliver') {
          vm.updateWaitStatus();
        }
        vm.order.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (!res.namedeliver) {
          $state.go('orders.list');
        }
        else if (vm.authentication.user._id === res.namedeliver._id) {
          $state.go('assignlist');
        }
        else {
          $state.go('orders.list');
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
