(function () {
  'use strict';

  // Sells controller
  angular
    .module('sells')
    .controller('SellsController', SellsController);

  SellsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sellResolve', 'AccountchartsService'];

  function SellsController($scope, $state, $window, Authentication, sell, AccountchartsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sell = sell;
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
      var dat = new Date(vm.sell.docdate);
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    function creditdayChanged(docdate) {
      vm.sell.drilldate = dat.addDays(vm.sell.creditday);

      // var noMath = (vm.sell.drilldate - vm.sell.docdate) / 86400000;
      // var parse = parseInt((vm.sell.drilldate - vm.sell.docdate) / 86400000);
      // vm.sell.creditday = parse + 1;


    }

    function setData() {

      if (vm.sell.drilldate) {
        vm.sell.docdate = new Date(vm.sell.docdate);
        vm.sell.drilldate = new Date(vm.sell.drilldate);
      } else {
        vm.sell.docdate = new Date();
        vm.sell.drilldate = new Date();
      }
      if (!vm.sell.items) {
        vm.sell.items = [{
          
        }];
      }

    }

    function readClient() {

      vm.client = AccountchartsService.query();

    }

    function selectCustomer() {
      vm.sell.creditday = vm.sell.client.creditday;
      vm.sell.drilldate = dat.addDays(vm.sell.creditday);
    }


    function readProduct() {

      vm.products = AccountchartsService.query();

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

      vm.sell.amount = 0;
      vm.sell.vatamount = 0;
      vm.sell.whtamount = 0;
      vm.sell.totalamount = 0;

      vm.sell.items.forEach(function (itm) {

        vm.sell.amount += itm.amount;
        vm.sell.vatamount += itm.vatamount;
        vm.sell.whtamount += itm.whtamount;
        vm.sell.totalamount += itm.totalamount;

      });

    }

    function changeUnitPrice(item) {
      // item.unitprice = item.product.priceexcludevat;
      // calculate(item);
    }

    function init() {

      vm.setData();
      vm.readClient();
      vm.readProduct();

    }

    function selectedProduct() {
      vm.sell.items.push({
       
      });
    }

    function removeProduct(index) {
      vm.sell.items.splice(index, 1);
      calculate();
    }
    // Remove existing Sell
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sell.$remove($state.go('sells.list'));
      }
    }

    // Save Sell
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sellForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sell._id) {
        vm.sell.$update(successCallback, errorCallback);
      } else {
        vm.sell.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sells.view', {
          sellId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
