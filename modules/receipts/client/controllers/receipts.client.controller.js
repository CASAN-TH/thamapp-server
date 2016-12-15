(function () {
  'use strict';

  // Receipts controller
  angular
    .module('receipts')
    .controller('ReceiptsController', ReceiptsController);

  ReceiptsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'receiptResolve', 'ProductsService', 'CompaniesService'];

  function ReceiptsController($scope, $state, $window, Authentication, receipt, ProductsService, CompaniesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.receipt = receipt;
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
    vm.selectedProductss = null;
    vm.changeUnitPrice = changeUnitPrice;
    vm.removeProduct = removeProduct;

    var dat = new Date();
    Date.prototype.addDays = function (days) {
      var dat = new Date(vm.receipt.docdate);
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    function creditdayChanged(docdate) {
      // if (!docdate) {
      vm.receipt.drilldate = dat.addDays(vm.receipt.creditday);
      // } else {
      //   vm.receipt.creditday = Math.round((vm.receipt.drilldate - vm.receipt.docdate) / 86400000);
      // }
    }

    function setData() {

      if (vm.receipt._id) {
        vm.receipt.docdate = new Date(vm.receipt.docdate);
        vm.receipt.drilldate = new Date(vm.receipt.drilldate);
      } else {
        vm.receipt.docdate = new Date();
        vm.receipt.drilldate = new Date();
      }

      if (!vm.receipt.items) {
        vm.receipt.items = [{
          product: new ProductsService(),
          qty: 1
        }];
      }

    }

    function readClient() {

      vm.client = CompaniesService.query();

    }

    function selectCustomer() {
      vm.receipt.creditday = vm.receipt.client.creditday;
      vm.receipt.drilldate = dat.addDays(vm.receipt.creditday);
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

      vm.receipt.amount = 0;
      vm.receipt.vatamount = 0;
      vm.receipt.whtamount = 0;
      vm.receipt.totalamount = 0;

      vm.receipt.items.forEach(function (itm) {

        vm.receipt.amount += itm.amount;
        vm.receipt.vatamount += itm.vatamount;
        vm.receipt.whtamount += itm.whtamount;
        vm.receipt.totalamount += itm.totalamount;

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
      vm.receipt.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }

    function removeProduct(index) {
      vm.receipt.items.splice(index, 1);
      calculate();
    }

    // Remove existing Receipt
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.receipt.$remove($state.go('receipts.list'));
      }
    }

    // Save Receipt
    function save(isValid) {

      if (vm.receipt.receiptstated === 'Cash') {
        vm.receipt.receiptrefno = '';
      }

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.receiptForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.receipt._id) {
        vm.receipt.$update(successCallback, errorCallback);
      } else {
        vm.receipt.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('receipts.view', {
          receiptId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
