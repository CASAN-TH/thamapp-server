(function () {
  'use strict';

  // Requestorders controller
  angular
    .module('requestorders')
    .controller('RequestordersController', RequestordersController);

  RequestordersController.$inject = ['$scope', '$state', '$http', '$window', 'Authentication', 'requestorderResolve', 'ProductsService', 'Users'];

  function RequestordersController($scope, $state, $http, $window, Authentication, requestorder, ProductsService, Users) {
    var vm = this;
    vm.users = Users;
    vm.authentication = Authentication;
    vm.requestorder = requestorder;
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
    vm.selectProduct = selectProduct;
    vm.readCustomer = readCustomer;
    vm.delivers = [];
    vm.transports = [];
    vm.customers = [];
    vm.selectCustomer = selectCustomer;
    vm.selectDeliver = selectDeliver;
    vm.selectTransport = selectTransport;
    vm.addHis = addHis;
    vm.readTransport = readTransport;
    // vm.updateDeliver = updateDeliver;
    vm.addQty = addQty;
    vm.removeQty = removeQty;
    if (vm.requestorder.items) {
      vm.requestorder.items = vm.requestorder.items;
    } else {
      vm.requestorder.items = [];
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
      vm.requestorder.items.push({
        product: item,
        qty: 1
      });
      sumary(vm.requestorder.items);
    }

    // function updateDeliver() {
    //   vm.requestorder.deliverystatus = 'request';
    //   console.log(vm.requestorder.deliverystatus);
    //   vm.addHis();
    //   vm.requestorder.$update(successCallback, errorCallback);
    //   function successCallback(res) {

    //   }

    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }

    //   $state.go('requestorders.list');
    // }

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
      vm.requestorder.shipping.firstname = vm.cust.firstName;
      vm.requestorder.shipping.lastname = vm.cust.lastName;
      vm.requestorder.shipping.tel = vm.cust.address.tel;
      vm.requestorder.shipping.address = vm.cust.address.address;
      vm.requestorder.shipping.subdistrict = vm.cust.address.subdistrict;
      vm.requestorder.shipping.district = vm.cust.address.district;
      vm.requestorder.shipping.province = vm.cust.address.province;
      vm.requestorder.shipping.postcode = vm.cust.address.postcode;
      vm.requestorder.shipping.email = vm.cust.email;
    }

    function selectDeliver(deli) {
      vm.deliver = deli;
      vm.requestorder.shipping = {
        firstname: deli.firstName,
        lastname: deli.lastName,
        address: deli.address.address,
        postcode: deli.address.postcode,
        subdistrict: deli.address.subdistrict,
        province: deli.address.province,
        district: deli.address.district,
        tel: deli.address.tel,
        email: deli.email
      };
      vm.requestorder.namedeliver = vm.deliver;
    }

    function selectTransport(tran) {
      vm.transport = tran;
      vm.requestorder.transport = vm.transport;
      console.log(vm.requestorder);
    }


    function readDeliver() {
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.deliver = Users.query(function () {
          angular.forEach(vm.deliver, function (user) {
            if (user.roles[0] === 'deliver')
              vm.delivers.push(user);
          });
          console.log(vm.delivers);
        });
      }

    }

    function readTransport() {
     
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.transport = Users.query(function () {
          angular.forEach(vm.transport, function (user) {
            if (user.roles[0] === 'transporter')
              vm.transports.push(user);
          });
          console.log(vm.transports);
        });
      }

    }

    function calculate(item) {
      item.qty = item.qty || 1;
      item.amount = item.product.retailerprice * item.qty;

      sumary(vm.requestorder.items);
    }

    function sumary(items) {
      vm.requestorder.totalamount = 0;
      angular.forEach(items, function (prod) {
        prod.amount = prod.product.retailerprice * prod.qty;
        //vm.order.amount = prod.amount;
        vm.requestorder.totalamount += prod.amount;
      });
      vm.requestorder.amount = vm.requestorder.totalamount;
    }

    function addItem() {
      vm.requestorder.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }

    function removeItem(item) {
      //vm.requestorder.items.splice(item);
      vm.requestorder.items.splice(item, 1);

      sumary(vm.requestorder.items);
    }

    function addHis() {
      vm.requestorder.historystatus.push({
        status: vm.requestorder.deliverystatus,
        datestatus: new Date()
      });
    }

    function productChanged(item) {

      item.qty = item.qty || 1;
      item.amount = item.product.price * item.qty;

      sumary();
    }

    function showstatuspost() {
      if (vm.requestorder._id) {
        if (vm.requestorder.delivery.deliveryid === '1' && vm.authentication.user.roles[0] === 'admin') {
          vm.showstatus = false;
        }
      }
    }

    function readDeliverid() {
      console.log(vm.authentication.user.roles[0]);
      if (vm.requestorder._id) {
        if (vm.requestorder.delivery.deliveryid === '1' && (vm.authentication.user.roles[0] === 'admin' || vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver')) {
          vm.show = false;
        } else if (vm.requestorder.delivery.deliveryid === '0' && (vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver')) {
          vm.show = false;
        } else if (vm.requestorder.deliverystatus === 'accept' && vm.authentication.user.roles[0] === 'admin') {
          vm.show = false;
          vm.showdetail = false;
        }
      } else if (!vm.requestorder._id) {
        if (vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver') {
          vm.show = false;
        }
      }
    }

    function init() {
      vm.readProduct();
      vm.readDeliver();
      vm.readTransport();
      if (!vm.requestorder._id && vm.authentication.user.roles[0] === 'admin') {
        vm.requestorder.docdate = new Date();
        vm.requestorder.docno = (+ new Date());
        // vm.order.items = [{
        //   product: new ProductsService(),
        //   qty: 1
        // }];

        vm.requestorder.deliverystatus = 'request';
        vm.requestorder.historystatus = [{
          status: 'request',
          datestatus: new Date()
        }];

        // vm.requestorder.shipping = {
        //   firstname: vm.requestorder.namedeliver.firstName,
        //   lastname: vm.authentication.user.lastName,
        //   address: vm.authentication.user.address.address,
        //   postcode: vm.authentication.user.address.postcode,
        //   subdistrict: vm.authentication.user.address.subdistrict,
        //   province: vm.authentication.user.address.province,
        //   district: vm.authentication.user.address.district,
        //   tel: vm.authentication.user.address.tel,
        //   email: vm.authentication.user.email
        // };
        vm.requestorder.delivery = {
          deliveryid: '0'
        };
        // vm.order.deliverystatus = 'complete';
        // vm.requestorder.namedeliver = vm.authentication.user;
        vm.requestorder.user = vm.authentication.user;
        // vm.requestorder.discountpromotion = 0;
        // vm.requestorder.totalamount = 0;
        // if (vm.requestorder.amount) {
        //   vm.requestorder.amount = vm.requestorder.amount;
        // } else {
        //   vm.requestorder.amount = 0;
        // }

      }
      else if (!vm.requestorder._id) {
        vm.requestorder.docdate = new Date();
        vm.requestorder.items = [{
          product: new ProductsService(),
          qty: 1
        }];
        // vm.order.historystatus = [{
        //   status: 'confirmed',
        //   datestatus: new Date()
        // }];
        vm.requestorder.shipping = {
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
        vm.requestorder.delivery = {
          deliveryid: '0'
        };
      } else {
        vm.requestorder.docdate = new Date(vm.requestorder.docdate);
      }
      // readDeliverid();
      // showstatuspost();

    }

    function selectedProduct() {
      vm.requestorder.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }

    // Remove existing Requestorder
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.requestorder.$remove($state.go('requestorders.list'));
      }
    }

    // Save Requestorder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.requestorderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.requestorder._id) {
        vm.requestorder.$update(successCallback, errorCallback);
      } else {
        vm.requestorder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        // $state.go('requestorders.list', {
        //   requestorderId: res._id
        // });
        $state.go('requestorders.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());