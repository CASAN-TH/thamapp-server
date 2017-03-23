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
    vm.statusWaitreview = statusWaitreview;
    vm.statusWaitreceipt = statusWaitreceipt;
    vm.addattm = addattm;
    vm.addHis = addHis;
    vm.remove = function (itm) {
      if ($window.confirm('คุณต้องการลบรายการนี้ ?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        vm.accuralreceipts = AccuralreceiptsService.query();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    };

    vm.confirmed = function (data) {
      if (vm.authentication.user.roles[0] === 'admin') {
        if (data.arstatus === 'confirmed') {
          return true;
        }
      }
    };

    function addHis(data) {
      data.historystatus.push({
        status: data.arstatus,
        datestatus: new Date()
      });
    }

    function statusWaitreview(data) {
      data.arstatus = 'wait for confirmed';
      vm.addHis(data);
      data.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function addattm(data) {
      // vm.accuralreceipts.attm = data.attm;
      data.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function statusWaitreceipt(data) {
      data.arstatus = 'receipt';
      vm.addHis(data);
      data.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

  }
}());
