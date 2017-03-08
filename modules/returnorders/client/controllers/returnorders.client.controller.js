(function () {
  'use strict';

  // Returnorders controller
  angular
    .module('returnorders')
    .controller('ReturnordersController', ReturnordersController);

  ReturnordersController.$inject = ['$scope', '$state', '$http', '$window', 'Authentication', 'returnorderResolve', 'ProductsService', 'Users'];

  function ReturnordersController($scope, $state, $http, $window, Authentication, returnorder, ProductsService, Users) {
    var vm = this;
    vm.users = Users;
    vm.authentication = Authentication;
    vm.returnorder = returnorder;
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
    vm.reject = reject;
    vm.newReturn = newReturn;
    vm.addHis = addHis;
    vm.readTransport = readTransport;
    // vm.updateDeliver = updateDeliver;
    vm.addQty = addQty;
    vm.removeQty = removeQty;
    // vm.exportPdf = exportPdf;
    if (vm.returnorder.items) {
      vm.returnorder.items = vm.returnorder.items;
    } else {
      vm.returnorder.items = [];
    }
    // function exportPdf() {

    // }

    function reject(item) {
      var conf = confirm('ยกเลิกรายการ');
      if (conf === true) {
        if (item.deliverystatus === 'response') {
          item.deliverystatus = 'reject';
          vm.addHis(item);
          vm.newReturn(item);
        }
      }
    }

    function newReturn(item) {
      if (item.deliverystatus === 'reject') {
        item.deliverystatus = 'return';
        item.transport = null;
        vm.addHis(item);
      }
      item.$update(successCallback, errorCallback);
      function successCallback(res) {
        $state.go('returnorders.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
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
      vm.returnorder.items.push({
        product: item,
        qty: 1,
        retailerprice: item.retailerprice
      });
      console.log(item);
      sumary(vm.returnorder.items);
    }

    // function updateDeliver() {
    //   vm.returnorder.deliverystatus = 'return';
    //   console.log(vm.returnorder.deliverystatus);
    //   vm.addHis();
    //   vm.returnorder.$update(successCallback, errorCallback);
    //   function successCallback(res) {

    //   }

    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }

    //   $state.go('returnorders.list');
    // }

    function readProduct() {
      vm.products = ProductsService.query();
      console.log(vm.products);
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
      // vm.returnorder.shipping.firstname = vm.cust.firstName;
      // vm.returnorder.shipping.lastname = vm.cust.lastName;
      // vm.returnorder.shipping.tel = vm.cust.address.tel;
      // vm.returnorder.shipping.address = vm.cust.address.address;
      // vm.returnorder.shipping.subdistrict = vm.cust.address.subdistrict;
      // vm.returnorder.shipping.district = vm.cust.address.district;
      // vm.returnorder.shipping.province = vm.cust.address.province;
      // vm.returnorder.shipping.postcode = vm.cust.address.postcode;
      // vm.returnorder.shipping.email = vm.cust.email;
    }

    function selectDeliver(deli) {
      vm.deliver = deli;
      vm.returnorder.namedeliver = vm.deliver;
    }

    function selectTransport(tran) {
      vm.transport = tran;
      vm.returnorder.transport = vm.transport;
      console.log(vm.returnorder);
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
      item.qty = item.qty;
      item.retailerprice = item.product.retailerprice;
      item.amount = item.retailerprice * item.qty;

      sumary(vm.returnorder.items);
    }

    function sumary(items) {
      vm.returnorder.totalamount = 0;
      vm.returnorder.amountqty = 0;
      angular.forEach(items, function (prod) {
        prod.amount = prod.retailerprice * prod.qty;
        vm.returnorder.amountqty += prod.qty;
        //vm.order.amount = prod.amount;
        vm.returnorder.totalamount += prod.amount;
      });
      console.log(vm.returnorder.amountqty);
      vm.returnorder.amount = vm.returnorder.totalamount;
    }

    function addItem() {
      vm.returnorder.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }

    function removeItem(item) {
      //vm.returnorder.items.splice(item);
      vm.returnorder.items.splice(item, 1);

      sumary(vm.returnorder.items);
    }

    function addHis() {
      vm.returnorder.historystatus.push({
        status: vm.returnorder.deliverystatus,
        datestatus: new Date()
      });
    }

    function productChanged(item) {

      item.qty = item.qty || 1;
      item.amount = item.product.price * item.qty;

      sumary();
    }

    function showstatuspost() {
      if (vm.returnorder._id) {
        if (vm.returnorder.delivery.deliveryid === '1' && vm.authentication.user.roles[0] === 'admin') {
          vm.showstatus = false;
        }
      }
    }

    function readDeliverid() {
      console.log(vm.authentication.user.roles[0]);
      if (vm.returnorder._id) {
        if (vm.returnorder.delivery.deliveryid === '1' && (vm.authentication.user.roles[0] === 'admin' || vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver')) {
          vm.show = false;
        } else if (vm.returnorder.delivery.deliveryid === '0' && (vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver')) {
          vm.show = false;
        } else if (vm.returnorder.deliverystatus === 'accept' && vm.authentication.user.roles[0] === 'admin') {
          vm.show = false;
          vm.showdetail = false;
        }
      } else if (!vm.returnorder._id) {
        if (vm.authentication.user.roles[0] === 'user' || vm.authentication.user.roles[0] === 'deliver') {
          vm.show = false;
        }
      }
    }

    function init() {
      vm.readProduct();
      vm.readDeliver();
      vm.readTransport();
      if (!vm.returnorder._id) {
        if (vm.authentication.user.roles[0] === 'deliver') {
          vm.returnorder.namedeliver = vm.authentication.user;
        }
        vm.returnorder.docdate = new Date();
        vm.returnorder.docno = (+ new Date());
        // vm.order.items = [{
        //   product: new ProductsService(),
        //   qty: 1
        // }];

        vm.returnorder.deliverystatus = 'return';
        vm.returnorder.historystatus = [{
          status: 'return',
          datestatus: new Date()
        }];

        vm.returnorder.shipping = {
          firstname: 'บริษัท ธรรมธุรกิจ',
          lastname: 'เทรดดิ้ง จำกัด',
          address: '11 ซอย พระราม9 60(ซอย 6 เสรี8)',
          postcode: '10250',
          subdistrict: '-',
          province: 'กรุงเทพมหานคร',
          district: 'สวนหลวง',
          tel: '-',
          email: '-'
        };
        vm.returnorder.delivery = {
          deliveryid: '0'
        };
        // vm.order.deliverystatus = 'complete';
        // vm.returnorder.namedeliver = vm.authentication.user;
        vm.returnorder.user = vm.authentication.user;
        // vm.returnorder.discountpromotion = 0;
        // vm.returnorder.totalamount = 0;
        // if (vm.returnorder.amount) {
        //   vm.returnorder.amount = vm.returnorder.amount;
        // } else {
        //   vm.returnorder.amount = 0;
        // }

      }
      // else if (!vm.returnorder._id) {
      //   vm.returnorder.docdate = new Date();
      //   vm.returnorder.items = [{
      //     product: new ProductsService(),
      //     qty: 1
      //   }];
      //   vm.returnorder.shipping = {
      //     firstname: '',
      //     lastname: '',
      //     address: '',
      //     postcode: '',
      //     subdistrict: '',
      //     province: '',
      //     district: '',
      //     tel: '',
      //     email: ''
      //   };
      //   vm.returnorder.delivery = {
      //     deliveryid: '0'
      //   };
      // } 
      else {
        vm.returnorder.docdate = new Date(vm.returnorder.docdate);
      }
      // readDeliverid();
      // showstatuspost();

    }

    function selectedProduct() {
      vm.returnorder.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }

    // Remove existing Returnorder
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.returnorder.$remove($state.go('returnorders.list'));
      }
    }

    // Save Returnorder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.returnorderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.returnorder._id) {
        vm.returnorder.$update(successCallback, errorCallback);
      } else {
        vm.returnorder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        console.log(res);
        if (vm.authentication.user._id === res.namedeliver) {
          $state.go('returndeliver');
        }
        else {
          $state.go('returnorders.list');
        }
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());