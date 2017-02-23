(function () {
  'use strict';

  angular
    .module('accuralreceipts')
    .controller('ArController', ArController);

  ArController.$inject = ['$scope', 'Users', 'AccuralreceiptsService', 'Authentication'];

  function ArController($scope, Users, AccuralreceiptsService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.accuralreceipts = AccuralreceiptsService.query();
    vm.init = init;
    vm.listWaitconfirmed = listWaitconfirmed;
    vm.listConfirmed = listConfirmed;
    vm.listArWaitconfirmed = [];
    vm.listArConfirmed = [];
    vm.waitconfirmed = waitconfirmed;
    // vm.confirmed = confirmed;
    vm.addHis = addHis;
    // Ar controller logic
    // ...

    function init() {
      vm.listWaitconfirmed();
      vm.listConfirmed();
    }

    function listWaitconfirmed() {
      vm.listWait = AccuralreceiptsService.query(function () {
        angular.forEach(vm.listWait, function (items) {
          console.log(items);
          if (items.namedeliver) {
            if (items.namedeliver._id === vm.authentication.user._id) {
              if (items.namedeliver._id === vm.authentication.user._id && items.deliverystatus === 'wait for confirmed') {
                vm.listArWaitconfirmed.push(items);
              }
            }
          }
        });
      });
    }

    function listConfirmed() {
      vm.listCon = AccuralreceiptsService.query(function () {
        angular.forEach(vm.listCon, function (items) {
          console.log(items);
          if (items.namedeliver) {
            if (items.namedeliver._id === vm.authentication.user._id && items.deliverystatus === 'confirmed') {
              vm.listArConfirmed.push(items);
            }
          }
        });
      });
    }

    function waitconfirmed(item) {
      item.deliverystatus = 'confirmed';
      vm.addHis(item);
      item.$update(successCallback, errorCallback);
      function successCallback(res) {
        vm.listArWaitconfirmed = [];
        vm.listArConfirmed = [];
        vm.init();
      }
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // function confirmed(item) {
    //   item.deliverystatus = 'confirmed';
    //   vm.addHis(item);
    //   item.$update(successCallback, errorCallback);
    //   function successCallback(res) {
    //     vm.listArWaitconfirmed = [];
    //     vm.listArConfirmed = [];
    //     vm.init();
    //   }
    //   function errorCallback(res) {
    //     vm.error = res.data.message;
    //   }
    // }

    function addHis(item) {
      item.historystatus.push({
        status: item.deliverystatus,
        datestatus: new Date()
      });
    }


  }
})();
