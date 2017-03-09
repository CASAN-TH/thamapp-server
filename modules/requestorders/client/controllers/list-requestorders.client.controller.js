(function () {
  'use strict';

  angular
    .module('requestorders')
    .controller('RequestordersListController', RequestordersListController);

  RequestordersListController.$inject = ['$state', 'RequestordersService', 'Authentication', '$window'];

  function RequestordersListController($state, RequestordersService, Authentication, $window) {
    var vm = this;
    vm.authentication = Authentication;
    vm.requestProduct = requestProduct;
    vm.requestorders = RequestordersService.query();
    vm.reject = reject;
    vm.addHis = addHis;
    vm.newRequest = newRequest;

    function reject(item) {
      var conf = confirm('ปฏิเสธรายการ');
      if (conf === true) {
        if (item.deliverystatus === 'response') {
          item.deliverystatus = 'reject';
          vm.addHis(item);
          vm.newRequest(item);
        }
      }
      console.log(item);
    }

    function newRequest(item) {
      if (item.deliverystatus === 'reject') {
        item.deliverystatus = 'request';
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
        // $state.go('requestorders.list');
        vm.requestorders = RequestordersService.query();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
      // itm.$remove();
    };

    vm.update = function (itm) {
      if (itm._id) {
        $state.go('requestorders.edit', {
          requestorderId: itm._id
        });
      }
    };

    function requestProduct(req) {
      vm.requestprod = req;
      // console.log(vm.requestprod);
    }
  }
}());