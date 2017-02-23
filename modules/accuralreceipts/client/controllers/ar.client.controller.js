(function () {
  'use strict';

  angular
    .module('accuralreceipts')
    .controller('ArController', ArController);

  ArController.$inject = ['$state', 'AccuralreceiptsService', 'Authentication', '$window'];

  function ArController($state, AccuralreceiptsService, Authentication, $window) {
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
      data.arstatus = 'confirmed';
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
      vm.listWait = AccuralreceiptsService.query(function () {
        angular.forEach(vm.listWait, function (items) {
          if (items.namedeliver) {
            if (items.namedeliver._id === vm.authentication.user._id) {
              if (items.namedeliver._id === vm.authentication.user._id && items.arstatus === 'wait for review') {
                vm.waitreview.push(items);
              }else if (items.namedeliver._id === vm.authentication.user._id && items.arstatus === 'wait for confirmed') {
                vm.waitconfirmed.push(items);
              }else if (items.namedeliver._id === vm.authentication.user._id && items.arstatus === 'confirmed') {
                vm.confirmed.push(items);
              }else if (items.namedeliver._id === vm.authentication.user._id && items.arstatus === 'receipt') {
                vm.receipt.push(items);
              }
            }
          }
        });
      });
    }

    


  }
})();
