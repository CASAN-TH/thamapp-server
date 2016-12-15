(function () {
  'use strict';

  // Payments controller
  angular
    .module('payments')
    .controller('PaymentsController', PaymentsController);

  PaymentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'paymentResolve', 'ProductsService', 'CompaniesService'];

  function PaymentsController($scope, $state, $window, Authentication, payment, ProductsService, CompaniesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.payment = payment;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.setData = setData;
    vm.readClient = readClient;
    vm.readProduct = readProduct;
    vm.selectCustomer = selectCustomer;
    vm.creditdayChanged = creditdayChanged;
    vm.calculate = calculate;
    vm.init = init;
    vm.selectedProduct = selectedProduct;
    vm.changeUnitPrice = changeUnitPrice;
    vm.removeProduct = removeProduct;

    var dat = new Date();
    Date.prototype.addDays = function (days) {
      var dat = new Date(vm.payment.docdate);
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    function creditdayChanged(docdate) {
      vm.payment.drilldate = dat.addDays(vm.payment.creditday);

      // var noMath = (vm.payment.drilldate - vm.payment.docdate) / 86400000;
      // var parse = parseInt((vm.payment.drilldate - vm.payment.docdate) / 86400000);
      // vm.payment.creditday = parse + 1;


    }

    function setData() {

      if (vm.payment._id) {
        vm.payment.docdate = new Date(vm.payment.docdate);
        vm.payment.drilldate = new Date(vm.payment.drilldate);
      } else {
        vm.payment.docdate = new Date();
        vm.payment.drilldate = new Date();
      }
      if (!vm.payment.items) {
        vm.payment.items = [{
          product: new ProductsService(),
          qty: 1
        }];
      }

    }

    function readClient() {

      vm.client = CompaniesService.query();

    }

    function selectCustomer() {
      vm.payment.creditday = vm.payment.client.creditday;
      vm.payment.drilldate = dat.addDays(vm.payment.creditday);
    }


    function readProduct() {

      vm.products = ProductsService.query();

    }

    function calculate(item) {
      // item.unitprice = item.product.priceexcludevat;
      // item.qty = 1;
      if (item) {
        item.amount = item.unitprice * item.qty;
        item.vatamount = item.amount * 0.07;
        if (item.product.category === 'S') {
          item.whtamount = item.amount * 0.03;
        } else if (item.product.category === 'R') {
          item.whtamount = item.amount * 0.05;
        } else {
          item.whtamount = 0;
        }
        item.totalamount = (item.amount + item.vatamount) - item.whtamount;
      }

      vm.payment.amount = 0;
      vm.payment.vatamount = 0;
      vm.payment.whtamount = 0;
      vm.payment.totalamount = 0;

      vm.payment.items.forEach(function (itm) {

        vm.payment.amount += itm.amount;
        vm.payment.vatamount += itm.vatamount;
        vm.payment.whtamount += itm.whtamount;
        vm.payment.totalamount += itm.totalamount;

      });

    }

    function changeUnitPrice(item) {
      item.unitprice = item.product.priceexcludevat;
      calculate(item);
    }

    function init() {

      vm.setData();
      vm.readClient();
      vm.readProduct();

    }

    function selectedProduct() {
      vm.payment.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }

    function removeProduct(index) {
      vm.payment.items.splice(index, 1);
      calculate();
    }



    // Remove existing Payment
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.payment.$remove($state.go('payments.list'));
      }
    }

    // Save Payment
    function save(isValid) {

      if (vm.payment.paymentstated === 'Cash') {
        vm.payment.paymentrefno = '';
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.paymentForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.payment._id) {
        vm.payment.$update(successCallback, errorCallback);
      } else {
        vm.payment.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('payments.view', {
          paymentId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
