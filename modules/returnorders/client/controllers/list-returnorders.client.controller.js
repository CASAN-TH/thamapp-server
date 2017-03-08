(function () {
  'use strict';

  angular
    .module('returnorders')
    .controller('ReturnordersListController', ReturnordersListController);

  ReturnordersListController.$inject = ['$state', 'ReturnordersService', 'Authentication', '$window'];

  function ReturnordersListController($state, ReturnordersService, Authentication, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.returnProduct = returnProduct;
    vm.returnorders = ReturnordersService.query();
    vm.reject = reject;
    vm.addHis = addHis;
    vm.newReturn = newReturn;
    vm.receive = receive;

    function receive(item) {
      var conf = confirm('ได้รับรายการแจ้งคืน');
      if (conf === true) {
        item.deliverystatus = 'received';
        vm.addHis(item);

      }
      item.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function reject(item) {
      var conf = confirm('ยกเลิกรายการ');
      if (conf === true) {
        if (item.deliverystatus === 'response') {
          item.deliverystatus = 'reject';
          vm.addHis(item);
          vm.newReturn(item);
        }
      }
      console.log(item);
    }

    function newReturn(item) {
      if (item.deliverystatus === 'reject') {
        item.deliverystatus = 'return';
        item.transport = null;
        vm.addHis(item);
      }
      item.$update(successCallback, errorCallback);
      function successCallback(res) {

      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
      console.log(item);
    }

    function addHis(item) {
      item.historystatus.push({
        status: item.deliverystatus,
        datestatus: new Date()
      });
    }



    vm.remove = function (itm) {
      if ($window.confirm('คุณต้องการลบรายการนี้ ?')) {
        itm.$remove(successCallback, errorCallback);
      }

      function successCallback(res) {
        // $state.go('returnorders.list');
        vm.returnorders = ReturnordersService.query();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
      // itm.$remove();
    };

    vm.update = function (itm) {
      if (itm._id) {
        $state.go('returnorders.edit', {
          returnorderId: itm._id
        });
      }
    };

    function returnProduct(req) {
      vm.returnprod = req;
      // console.log(vm.returnprod);
    }
  }
}());