(function () {
  'use strict';

  angular
    .module('accuralreceipts')
    .controller('AccuralreceiptsListController', AccuralreceiptsListController);

  AccuralreceiptsListController.$inject = ['$state', 'AccuralreceiptsService', 'Authentication', '$window'];

  function AccuralreceiptsListController($state, AccuralreceiptsService, Authentication, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.accuralreceipts = AccuralreceiptsService.query();
    vm.waitreview = [];
    vm.waitconfirmed = [];
    vm.confirmed = [];
    vm.receipt = [];
    vm.statusWaitconfirmed = statusWaitconfirmed;
    vm.addHis = addHis;
    vm.readdata = readdata;
    vm.init = init;
    vm.remove = function (itm) {
      if ($window.confirm('คุณต้องการลบรายการนี้ ?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('accuralreceipts.list');
        vm.waitreview = [];
        vm.waitconfirmed = [];
        vm.confirmed = [];
        vm.receipt = [];
        vm.readdata();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };
    function init() {
      vm.readdata();
    }

    function addHis(data) {
      data.historystatus.push({
        status: data.arstatus,
        datestatus: new Date()
      });
    }

    function statusWaitconfirmed(data) {
      data.arstatus = 'wait for confirmed';
      vm.addHis(data);
      data.$update(successCallback, errorCallback);
      function successCallback(res) {
        vm.waitreview = [];
        vm.waitconfirmed = [];
        vm.confirmed = [];
        vm.receipt = [];
        vm.init();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function readdata() {
      vm.accuralreceipt = AccuralreceiptsService.query(function () {
        vm.accuralreceipt.forEach(function (order) {
          if (order.arstatus === 'wait for review') {
            vm.waitreview.push(order);
          } else if (order.arstatus === 'wait for confirmed') {
            vm.waitconfirmed.push(order);
          } else if (order.arstatus === 'confirmed') {
            vm.confirmed.push(order);
          } else if (order.arstatus === 'receipt') {
            vm.receipt.push(order);
          }
        });
        console.log(vm.waitreview);
      });
    }

  }
}());
