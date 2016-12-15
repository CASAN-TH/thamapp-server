(function () {
  'use strict';

  // Quotations controller
  angular
    .module('quotations')
    .controller('QuotationsController', QuotationsController);

  QuotationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'quotationResolve', 'ProductsService', 'CompaniesService'];

  function QuotationsController($scope, $state, $window, Authentication, quotation, ProductsService, CompaniesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.quotation = quotation;
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
      var dat = new Date(vm.quotation.docdate);
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    function creditdayChanged(docdate) {
      // if (!docdate) {
      vm.quotation.drilldate = dat.addDays(vm.quotation.creditday);
      // } else {
      //   vm.quotation.creditday = Math.round((vm.quotation.drilldate - vm.quotation.docdate) / 86400000);
      // }
    }

    function setData() {

      if (vm.quotation._id) {
        vm.quotation.docdate = new Date(vm.quotation.docdate);
        vm.quotation.drilldate = new Date(vm.quotation.drilldate);
      } else {
        vm.quotation.docdate = new Date();
        vm.quotation.drilldate = new Date();
      }

      if (!vm.quotation.items) {
        vm.quotation.items = [{
          product: new ProductsService(),
          qty: 1
        }];
      }

    }

    function readClient() {

      vm.client = CompaniesService.query();

    }

    function selectCustomer() {
      vm.quotation.creditday = vm.quotation.client.creditday;
      vm.quotation.drilldate = dat.addDays(vm.quotation.creditday);
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

      vm.quotation.amount = 0;
      vm.quotation.vatamount = 0;
      vm.quotation.whtamount = 0;
      vm.quotation.totalamount = 0;

      vm.quotation.items.forEach(function (itm) {

        vm.quotation.amount += itm.amount;
        vm.quotation.vatamount += itm.vatamount;
        vm.quotation.whtamount += itm.whtamount;
        vm.quotation.totalamount += itm.totalamount;

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
      vm.quotation.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }

    function removeProduct(index) {
      vm.quotation.items.splice(index, 1);
      calculate();
    }

    // Remove existing Quotation
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.quotation.$remove($state.go('quotations.list'));
      }
    }

    // Save Quotation
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.quotationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.quotation._id) {
        vm.quotation.$update(successCallback, errorCallback);
      } else {
        vm.quotation.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('quotations.view', {
          quotationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
