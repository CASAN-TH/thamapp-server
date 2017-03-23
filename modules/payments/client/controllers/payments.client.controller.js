(function () {
  'use strict';

  // Payments controller
  angular
    .module('payments')
    .controller('PaymentsController', PaymentsController);

  PaymentsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'paymentResolve', 'AccountchartsService'];

  function PaymentsController($scope, $state, $window, Authentication, payment, AccountchartsService) {
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
    vm.selectedProductss = null;
    vm.changeUnitPrice = changeUnitPrice;
    vm.removeProduct = removeProduct;
    vm.selectedPayfor = selectedPayfor;
    vm.removePayfor = removePayfor;
    vm.selectedPayby = selectedPayby;
    vm.removePayby = removePayby;
    vm.calpayfor = calpayfor;
    vm.calpayby = calpayby;


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

      if (vm.payment.drilldate) {
        vm.payment.docdate = new Date(vm.payment.docdate);
        vm.payment.drilldate = new Date(vm.payment.drilldate);
      } else {
        vm.payment.docdate = new Date();
        vm.payment.drilldate = new Date();
      }
      if (!vm.payment.items) {
        vm.payment.items = [{

        }];
      }
      if (!vm.payment.payby) {
        vm.payment.payby = [{

        }];
      }
      if (!vm.payment.payfor) {
        vm.payment.payfor = [{

        }];
      }

    }

    function readClient() {

      vm.client = AccountchartsService.query();

    }

    function selectCustomer() {
      vm.payment.creditday = vm.payment.client.creditday;
      vm.payment.drilldate = dat.addDays(vm.payment.creditday);
    }


    function readProduct() {

      vm.products = AccountchartsService.query();

    }

    function calpayfor(payfor) {
      if (payfor) {
        vm.payfor.amount = payfor.amount;
        vm.payment.payfor.totalamount = payfor.amount + payfor.amount;

      }

      vm.payment.totalamountpayfor = 0;

      vm.payment.payfor.forEach(function (itm) {

        vm.payment.totalamountpayfor += itm.amount;




      });


    }
    function calpayby(payby) {
      if (payby) {
        vm.payby.amount = payby.amount;
        vm.payment.payby.totalamount = payby.amount + payby.amount;

      }

      vm.payment.totalamountpayby = 0;

      vm.payment.payby.forEach(function (itm) {

        vm.payment.totalamountpayby += itm.amount;




      });


    }

    function calculate(item) {
      // item.unitprice = item.product.priceexcludevat;
      // item.qty = 1;
      // if (item) {
      //   item.amount = item.unitprice * item.qty;
      //   item.vatamount = item.amount * 0.07;
      //   if (item.product.category === 'S') {
      //     item.whtamount = item.amount * 0.03;
      //   } else if (item.product.category === 'R') {
      //     item.whtamount = item.amount * 0.05;
      //   } else {
      //     item.whtamount = 0;
      //   }
      //   item.totalamount = (item.amount + item.vatamount) - item.whtamount;
      // }

      // vm.payment.amount = 0;
      // vm.payment.vatamount = 0;
      // vm.payment.whtamount = 0;
      // vm.payment.totalamount = 0;

      // vm.payment.items.forEach(function (itm) {

      //   vm.payment.amount += itm.amount;
      //   vm.payment.vatamount += itm.vatamount;
      //   vm.payment.whtamount += itm.whtamount;
      //   vm.payment.totalamount += itm.totalamount;

      // });

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
      vm.payment.items.push({

      });
    }

    function removeProduct(index) {
      vm.payment.items.splice(index, 1);
      calculate();
    }

    // payby
    function selectedPayby() {
      vm.payment.payby.push({

      });
    }

    function removePayby(index) {
      vm.payment.payby.splice(index, 1);
      calculate();
    }
    // payfor
    function selectedPayfor() {
      vm.payment.payfor.push({

      });
    }
    // vm.payment.payfor.totalamount = vm.payment.amount;
    // console.log(vm.payment.payfor);

    function removePayfor(index) {
      vm.payment.payfor.splice(index, 1);
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
